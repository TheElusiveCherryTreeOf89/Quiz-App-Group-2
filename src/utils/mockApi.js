import { getAllQuizzes, getQuiz, putQuiz, clearQuizzes, getAllSubmissions, getMeta, setMeta, getCurrentUser, getToken, setToken, getPendingSubmissions, saveSubmission, getAllSubmissions as _getAllSubmissions } from './db';

let seeded = false;

async function ensureSeed() {
  if (seeded) return;
  seeded = true;
  try {
    const already = await getMeta('demoSeeded').catch(() => null);
    if (already) return;

    // seed users
    const users = [
      { name: 'alice', email: 'alice@example.com', role: 'student', studentId: 'S1001', averageScore: 0, quizzesTaken: 0, lastActivity: Date.now() },
      { name: 'bob', email: 'bob@example.com', role: 'student', studentId: 'S1002', averageScore: 0, quizzesTaken: 0, lastActivity: Date.now() },
      { name: 'instructor', email: 'instructor@example.com', role: 'instructor', id: 'I1', name_display: 'Instructor' }
    ];
    await setMeta('users', JSON.stringify(users));

    // seed a published quiz
    await clearQuizzes().catch(()=>{});
    const quiz = {
      id: 'quiz-1',
      title: 'Intro to UI Design',
      published: true,
      createdAt: Date.now(),
      questions: [
        { id: 'q1', type: 'mcq', question: 'What does UX stand for?', options: ['User Xperience','User Experience','Ultimate Experience'], correct: 'User Experience' }
      ]
    };
    await putQuiz(quiz).catch(()=>{});

    await setMeta('demoSeeded', '1');
  } catch (e) {
    console.warn('[mockApi] seed failed', e);
  }
}

function makeResp(data, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    data,
    json: async () => data,
    text: async () => (typeof data === 'string' ? data : JSON.stringify(data)),
  };
}

export async function handleMockRequest(url, options = {}) {
  await ensureSeed();
  const u = url.split('?')[0];
  const method = (options.method || 'GET').toUpperCase();
  try {
    if (u.endsWith('/api/quizzes/available.php')) {
      const q = await getAllQuizzes().catch(()=>[]);
      const published = Array.isArray(q) ? q.filter(qu => qu.published) : [];
      return makeResp(published);
    }

    if (u.endsWith('/api/quizzes/submitted')) {
      // for demo return empty submissions
      const subs = await _getAllSubmissions().catch(()=>[]);
      return makeResp(subs || []);
    }

    if (u.endsWith('/api/quizzes/results')) {
      const releasedRaw = await getMeta('resultsReleased').catch(()=>null);
      const released = releasedRaw === 'true' || releasedRaw === true;
      return makeResp({ released });
    }

    // login endpoints (student and instructor)
    if (u.endsWith('/api/auth/login.php') || u.endsWith('/api/instructor/login.php')) {
      const body = options.body ? JSON.parse(options.body) : {};
      const email = (body.email || body.username || '').toLowerCase();
      const password = body.password || body.pass || ''; // ignored in mock
      const rawUsers = await getMeta('users').catch(()=>null);
      let users = rawUsers ? JSON.parse(rawUsers) : [];
      let user = users.find(u=>u.email && u.email.toLowerCase() === email);
      if (!user) {
        // create a new instructor or student depending on endpoint
        const role = u.endsWith('/api/instructor/login.php') ? 'instructor' : 'student';
        user = { name: email.split('@')[0], email, role, studentId: `S${Math.floor(Math.random()*9000)+1000}`, quizzesTaken:0, averageScore:0, lastActivity: Date.now() };
        users.push(user);
        await setMeta('users', JSON.stringify(users));
      }
      const token = `mock-token-${email}-${Date.now()}`;
      // return shape similar to backend: { success: true, token, user }
      return makeResp({ success: true, token, user });
    }

    // registration endpoint
    if (u.endsWith('/api/auth/register.php')) {
      const body = options.body ? JSON.parse(options.body) : {};
      const rawUsers = await getMeta('users').catch(()=>null);
      const users = rawUsers ? JSON.parse(rawUsers) : [];
      const email = (body.email || '').toLowerCase();
      if (users.find(u=>u.email && u.email.toLowerCase() === email)) {
        return makeResp({ success: false, message: 'Email already registered' }, 400);
      }
      const user = {
        name: body.name || (email.split('@')[0]),
        email,
        role: body.role || 'student',
        studentId: body.studentNumber || `S${Math.floor(Math.random()*9000)+1000}`,
        program: body.program || null,
        quizzesTaken: 0,
        averageScore: 0,
        lastActivity: Date.now()
      };
      users.push(user);
      await setMeta('users', JSON.stringify(users));
      return makeResp({ success: true, message: 'Registered', user });
    }

    if (u.endsWith('/api/instructor/get-quizzes.php')) {
      const q = await getAllQuizzes().catch(()=>[]);
      return makeResp(Array.isArray(q) ? q : []);
    }

    // create / edit / delete quiz
    if (u.endsWith('/api/instructor/create-quiz.php') || u.endsWith('/api/instructor/edit-quiz.php')) {
      const body = options.body ? JSON.parse(options.body) : {};
      let quiz = body.quiz || body;
      if (u.endsWith('/api/instructor/edit-quiz.php')) {
        // For edit, merge with existing quiz
        const existing = await getQuiz(quiz.id || quiz.quiz_id).catch(() => null);
        if (existing) {
          const wasPublished = existing.published;
          quiz = { ...existing, ...quiz };
          const nowPublished = quiz.published;
          if (wasPublished !== nowPublished) {
            // Add notification for publish/unpublish
            const rawNotifs = await getMeta('instructorNotifications').catch(() => null);
            const notifs = rawNotifs ? JSON.parse(rawNotifs) : [];
            const action = nowPublished ? 'published' : 'unpublished';
            notifs.unshift({
              id: `notif-${Date.now()}`,
              title: `Quiz ${action}`,
              message: `Your quiz "${quiz.title}" has been ${action}.`,
              timestamp: Date.now(),
              read: false
            });
            await setMeta('instructorNotifications', JSON.stringify(notifs)).catch(() => {});
          }
        }
      }
      if (!quiz.id) {
        if (quiz.quiz_id) quiz.id = quiz.quiz_id;
        else quiz.id = `quiz-${Date.now()}-${Math.floor(Math.random()*1000)}`;
      }
      quiz.updatedAt = Date.now();
      await putQuiz(quiz).catch(()=>{});
      return makeResp({ success: true, quiz });
    }

    if (u.endsWith('/api/instructor/delete-quiz.php')) {
      const body = options.body ? JSON.parse(options.body) : {};
      const id = body.id || body.quizId || body.quiz_id;
      if (!id) return makeResp({ success: false, message: 'Missing id' }, 400);
      const all = await getAllQuizzes().catch(()=>[]);
      const remain = (Array.isArray(all) ? all : []).filter(q=>q.id !== id);
      await clearQuizzes().catch(()=>{});
      for (const q of remain) await putQuiz(q).catch(()=>{});
      return makeResp({ success: true, deleted: id });
    }

    // submissions and grading
    if (u.endsWith('/api/instructor/submissions.php') || u.endsWith('/api/quiz/submissions.php')) {
      const subs = await _getAllSubmissions().catch(()=>[]);
      return makeResp({ submissions: subs || [] });
    }

    if (u.endsWith('/api/instructor/release-results.php') || u.endsWith('/api/release-results.php')) {
      const body = options.body ? JSON.parse(options.body) : {};
      const released = body.released === true || body.released === 'true';
      await setMeta('resultsReleased', released ? 'true' : 'false').catch(()=>{});
      
      // Update all submissions to mark results as released
      if (released) {
        const allSubs = await _getAllSubmissions().catch(()=>[]);
        // Note: In a real implementation, you'd update each submission in the DB
        // For mock purposes, we just set the global flag
      }
      
      return makeResp({ success: true, released });
    }

    // analytics
    if (u.endsWith('/api/instructor/analytics.php') || u.endsWith('/api/analytics.php')) {
      const quizzes = await getAllQuizzes().catch(()=>[]);
      const submissions = await _getAllSubmissions().catch(()=>[]);

      // Calculate comprehensive analytics
      const totalStudents = new Set(submissions.map(s => s.studentEmail)).size;
      const totalQuizzes = quizzes.length;
      const totalSubmissions = submissions.length;

      // Calculate average score
      const avgScore = submissions.length > 0
        ? submissions.reduce((sum, s) => sum + (s.score || 0), 0) / submissions.length
        : 0;

      // Calculate pass/fail stats (assuming 70% is passing)
      const passCount = submissions.filter(s => (s.score / s.totalQuestions) * 100 >= 70).length;
      const failCount = submissions.length - passCount;
      const overallPassRate = submissions.length > 0 ? (passCount / submissions.length) * 100 : 0;

      // Calculate score ranges
      const scoreRanges = {};
      submissions.forEach(s => {
        const percentage = Math.floor((s.score / s.totalQuestions) * 100 / 10) * 10;
        const range = `${percentage}-${percentage + 9}%`;
        scoreRanges[range] = (scoreRanges[range] || 0) + 1;
      });

      // Calculate violation types
      const violationTypes = {};
      submissions.forEach(s => {
        if (s.violations > 0) {
          violationTypes['Tab Switches'] = (violationTypes['Tab Switches'] || 0) + s.violations;
        }
      });

      // Quiz performance
      const quizPerformance = quizzes.map(quiz => {
        const quizSubs = submissions.filter(s => s.quiz_id === quiz.id || s.quiz_id === quiz._id);
        const quizAvgScore = quizSubs.length > 0
          ? quizSubs.reduce((sum, s) => sum + (s.score || 0), 0) / quizSubs.length
          : 0;

        return {
          quizName: quiz.title || quiz.name || 'Untitled Quiz',
          submissions: quizSubs.length,
          averageScore: Math.round(quizAvgScore),
          passRate: quizSubs.length > 0
            ? Math.round((quizSubs.filter(s => (s.score / s.totalQuestions) * 100 >= 70).length / quizSubs.length) * 100)
            : 0
        };
      });

      // Completion rate (submissions vs expected total)
      const completionRate = totalQuizzes > 0 ? Math.min((totalSubmissions / (totalStudents * totalQuizzes)) * 100, 100) : 0;

      return makeResp({
        totalStudents,
        totalQuizzes,
        totalSubmissions,
        uniqueStudents: totalStudents,
        averageScore: Math.round(avgScore),
        avgScore: Math.round(avgScore),
        completionRate: Math.round(completionRate),
        passCount,
        failCount,
        overallPassRate: Math.round(overallPassRate),
        passRate: Math.round(overallPassRate),
        quizPerformance,
        scoreRanges,
        violationTypes,
        metrics: [
          { label: 'Total Students', value: totalStudents },
          { label: 'Total Quizzes', value: totalQuizzes },
          { label: 'Total Submissions', value: totalSubmissions },
          { label: 'Average Score', value: `${Math.round(avgScore)}%` }
        ]
      });
    }

    // quiz submit endpoint
    if (u.endsWith('/api/quiz/submit.php') || u.endsWith('/api/quiz/submit')) {
      // accept submission; caller will mark local record as synced
      return makeResp({ success: true });
    }

    // profile endpoints
    if (u.endsWith('/api/instructor/profile.php') || u.endsWith('/api/profile')) {
      if ((options.method || 'GET').toUpperCase() === 'GET') {
        const cur = await getCurrentUser().catch(()=>null);
        if (cur) return makeResp({ profile: cur });
        const rawUsers = await getMeta('users').catch(()=>null);
        const users = rawUsers ? JSON.parse(rawUsers) : [];
        const inst = users.find(x=>x.role==='instructor');
        return makeResp({ profile: inst || null });
      }
      // POST -> update
      const body = options.body ? JSON.parse(options.body) : {};
      const cur = await getCurrentUser().catch(()=>null);
      const updated = { ...(cur||{}), ...body };
      await setMeta('currentUser', updated).catch(()=>{});
      return makeResp({ success: true, profile: updated });
    }

    if (u.endsWith('/api/instructor/profile-avatar.php') || u.endsWith('/api/profile/picture')) {
      // accept any avatar upload in mock
      return makeResp({ success: true, url: '/assets/images/default-avatar.png' });
    }

    if (u.endsWith('/api/notifications')) {
      if (method === 'GET') {
        const raw = await getMeta('notifications').catch(()=>null);
        const notifs = raw ? JSON.parse(raw) : [];
        return makeResp(Array.isArray(notifs) ? notifs : []);
      }
      if (method === 'POST') {
        const body = options.body ? JSON.parse(options.body) : {};
        const raw = await getMeta('notifications').catch(()=>null);
        const notifs = raw ? JSON.parse(raw) : [];
        const n = { id: `n_${Date.now()}_${Math.floor(Math.random()*1000)}`, title: body.title || 'Notification', message: body.message || body.text || '', isRead: false, createdAt: Date.now() };
        notifs.unshift(n);
        await setMeta('notifications', JSON.stringify(notifs)).catch(()=>{});
        return makeResp({ success: true, notification: n });
      }
      return makeResp('Method Not Allowed', 405);
    }

    if (u.endsWith('/api/students.php') || u.endsWith('/api/instructor/students.php')) {
      const rawUsers = await getMeta('users').catch(()=>null);
      const users = rawUsers ? JSON.parse(rawUsers) : [];
      const students = users.filter(u => u.role === 'student');
      return makeResp({ students });
    }

    if (u.endsWith('/api/instructor/assign-students.php')) {
      const body = options.body ? JSON.parse(options.body) : {};
      const emails = body.emails || [];
      const rawUsers = await getMeta('users').catch(()=>null);
      const users = rawUsers ? JSON.parse(rawUsers) : [];
      for (const em of emails) {
        if (!users.find(u=>u.email===em)) {
          users.push({ name: em.split('@')[0], email: em, role: 'student', studentId: `S${Math.floor(Math.random()*9000)+1000}`, quizzesTaken: 0, averageScore: 0, lastActivity: Date.now() });
        }
      }
      await setMeta('users', JSON.stringify(users));
      return makeResp({ success: true, updated: emails.length });
    }

    // default: not found
    return makeResp('Not Found', 404);
  } catch (e) {
    console.error('[mockApi] handler error', e);
    return makeResp({ error: String(e) }, 500);
  }
}

export async function seedDemoData() {
  await ensureSeed();
}
