import { setCurrentUser, setToken, putQuiz, saveSubmission, setMeta } from './db';

// Expected input shape:
// {
//   users: [{id,email,name,role,bio,avatar,...}],
//   quizzes: [{id,title,description,questions,time_limit,...}],
//   submissions: [{id,student_id,quiz_id,answers,score,total_questions,violations,time_remaining,submitted_at}]
// }

export async function importDatabaseDump(dump) {
  const res = { users: 0, quizzes: 0, submissions: 0, errors: [] };
  try {
    if (Array.isArray(dump.users)) {
      for (const u of dump.users) {
        try {
          // For convenience, if this user matches current demo accounts, persist as currentUser/token
          if (u.email && (u.email === 'quizapp.instructor@gmail.com' || u.email === 'bjv.jkv@gmail.com' || u.email === 'pallerjohnbenedict@gmail.com')) {
            await setCurrentUser(u).catch(()=>{});
            // create a safe token placeholder
            await setTokenPlaceholder(u.email);
          }
          res.users++;
        } catch (e) {
          res.errors.push({ type: 'user', email: u.email, error: String(e) });
        }
      }
    }

    if (Array.isArray(dump.quizzes)) {
      for (const q of dump.quizzes) {
        try {
          // normalize questions if string
          const quiz = { ...q };
          if (typeof quiz.questions === 'string') {
            try { quiz.questions = JSON.parse(quiz.questions); } catch(e) { quiz.questions = []; }
          }
          await putQuiz(quiz);
          res.quizzes++;
        } catch (e) {
          res.errors.push({ type: 'quiz', id: q.id, error: String(e) });
        }
      }
    }

    if (Array.isArray(dump.submissions)) {
      for (const s of dump.submissions) {
        try {
          // Map DB submission to our local submission shape
          const submission = {
            student_id: s.student_id || s.studentId || null,
            studentEmail: s.studentEmail || null,
            studentName: s.studentName || null,
            quiz_id: s.quiz_id || s.quizId || s.quiz_id || null,
            score: s.score || 0,
            total_questions: s.total_questions || s.totalQuestions || 0,
            violations: s.violations || 0,
            time_remaining: s.time_remaining || s.timeRemaining || 0,
            submitted_at: s.submitted_at || s.submittedAt || (new Date()).toISOString(),
            answers: s.answers || s.answers_json || {},
            questions: s.questions || []
          };
          await saveSubmission(submission);
          res.submissions++;
        } catch (e) {
          res.errors.push({ type: 'submission', id: s.id, error: String(e) });
        }
      }
    }

    // Optionally write some metadata
    await setMeta('importedAt', new Date().toISOString()).catch(()=>{});

    return res;
  } catch (err) {
    res.errors.push({ type: 'fatal', error: String(err) });
    return res;
  }
}

// Create demo accounts quickly
export async function createDemoAccounts() {
  const users = [
    {
      name: 'Von Zymon Raphael B. Patagnan',
      email: 'bjv.jkv@gmail.com',
      password: 'VonZymon',
      role: 'student'
    },
    {
      name: 'John Benedict C. Paller',
      email: 'pallerjohnbenedict@gmail.com',
      password: 'Paller2003',
      role: 'student'
    },
    {
      name: 'Quiz App Instructor',
      email: 'quizapp.instructor@email.com',
      password: 'teach123',
      role: 'instructor'
    }
  ];

  const res = { created: 0, errors: [] };
  try {
    // store users list in meta for quick lookup by the app
    await setMeta('users', users);

    for (const u of users) {
      try {
        // set a placeholder token per user
        const token = btoa(JSON.stringify({ email: u.email, demo: true, ts: Date.now() }));
        await setMeta(`token_${u.email}`, token);
        res.created++;
      } catch (e) {
        res.errors.push({ email: u.email, error: String(e) });
      }
    }

    await setMeta('demoAccountsCreated', true);
    return res;
  } catch (err) {
    res.errors.push({ error: String(err) });
    return res;
  }
}

async function setTokenPlaceholder(email) {
  // Create a reproducible placeholder token and store via setToken if available
  try {
    const token = btoa(JSON.stringify({ email, importedAt: Date.now() }));
    // setToken may not be exported here; fall back to setMeta
    await setMeta('token', token).catch(()=>{});
  } catch (e) {
    // ignore
  }
}
