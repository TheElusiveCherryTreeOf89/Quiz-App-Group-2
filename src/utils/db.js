import { openDB } from 'idb';

const DB_NAME = 'quiz-app-db';
const DB_VERSION = 1;
let dbPromise = null;

export function initDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('quizzes')) {
          const store = db.createObjectStore('quizzes', { keyPath: 'id' });
          store.createIndex('by-published', 'published');
        }
        if (!db.objectStoreNames.contains('submissions')) {
          const submissions = db.createObjectStore('submissions', { keyPath: 'localId', autoIncrement: true });
          submissions.createIndex('by-status', 'status');
        }
        if (!db.objectStoreNames.contains('meta')) {
          db.createObjectStore('meta');
        }
      }
    });
  }
  return dbPromise;
}

export async function putQuiz(quiz) {
  const db = await initDB();
  return db.put('quizzes', quiz);
}

export async function getQuiz(id) {
  if (id === 'demo-quiz') {
    return {
      id: 'demo-quiz',
      title: 'Demo Quiz',
      description: 'Demo quiz for testing purposes',
      items: 8,
      timeLimit: '5 minutes',
      dueDate: 'N/A',
      attemptsAllowed: 1
    };
  }
  const db = await initDB();
  return db.get('quizzes', id);
}

export async function getAllQuizzes() {
  const db = await initDB();
  return db.getAll('quizzes');
}

export async function clearQuizzes() {
  const db = await initDB();
  return db.clear('quizzes');
}

export async function saveSubmission(submission) {
  const db = await initDB();
  // status: 'pending' | 'synced' | 'failed'
  const record = { ...submission, status: 'pending', createdAt: Date.now() };
  return db.add('submissions', record);
}

export async function getPendingSubmissions() {
  const db = await initDB();
  return db.getAllFromIndex('submissions', 'by-status', 'pending');
}

export async function getAllSubmissions() {
  const db = await initDB();
  return db.getAll('submissions');
}

export async function deleteSubmission(localId) {
  const db = await initDB();
  return db.delete('submissions', localId);
}


export async function setMeta(key, value) {
  const db = await initDB();
  return db.put('meta', value, key);
}

export async function getMeta(key) {
  const db = await initDB();
  return db.get('meta', key);
}

// Convenience helpers for auth and user session
export async function setToken(token) {
  return setMeta('token', token);
}

export async function getToken() {
  return getMeta('token');
}

export async function removeToken() {
  const db = await initDB();
  return db.delete('meta', 'token');
}

export async function setCurrentUser(user) {
  return setMeta('currentUser', user);
}

export async function getCurrentUser() {
  return getMeta('currentUser');
}

export async function removeCurrentUser() {
  const db = await initDB();
  return db.delete('meta', 'currentUser');
}

export async function updateSubmissionStatus(localId, status) {
  const db = await initDB();
  const tx = db.transaction('submissions', 'readwrite');
  const store = tx.objectStore('submissions');
  const rec = await store.get(localId);
  if (!rec) return null;
  rec.status = status;
  await store.put(rec);
  await tx.done;
  return rec;
}
