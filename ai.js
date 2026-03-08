// ─── EduQuest — db.js ────────────────────────────────────────────────────────
// Lightweight localStorage "database" with JSON serialisation.
// All keys are namespaced under "eq_".

const DB = {
  get(key) {
    try { const v = localStorage.getItem('eq_' + key); return v ? JSON.parse(v) : null; }
    catch { return null; }
  },
  set(key, value) {
    try { localStorage.setItem('eq_' + key, JSON.stringify(value)); return true; }
    catch { return false; }
  },
  remove(key) { localStorage.removeItem('eq_' + key); },
};

// ── Seed Data ────────────────────────────────────────────────────────────────
const SEED_USERS = [
  { id: 'u-teacher-1', name: 'Mr. Santos',  role: 'teacher', username: 'teacher',  password: 'teacher123' },
  { id: 'u-student-1', name: 'Maria Cruz',  role: 'student', username: 'student1', password: 'pass123' },
  { id: 'u-student-2', name: 'Juan Reyes',  role: 'student', username: 'student2', password: 'pass123' },
];

const SEED_QUIZ = {
  id: 'quiz-seed-1',
  teacherId: 'u-teacher-1',
  title: 'General Science Quiz',
  subject: 'Science',
  timeLimit: 10,
  createdAt: new Date().toISOString(),
  questions: [
    { id: 'qs-1', text: 'What is the chemical formula for water?',           options: ['H₂O','CO₂','O₂','NaCl'],                       answer: 0 },
    { id: 'qs-2', text: 'How many planets are in our solar system?',         options: ['7','8','9','10'],                               answer: 1 },
    { id: 'qs-3', text: 'What force keeps objects on the surface of Earth?', options: ['Magnetism','Gravity','Friction','Tension'],      answer: 1 },
    { id: 'qs-4', text: 'What is the approximate speed of light?',           options: ['300,000 km/s','150,000 km/s','450,000 km/s','200,000 km/s'], answer: 0 },
    { id: 'qs-5', text: 'Which gas do plants primarily absorb?',             options: ['Oxygen','Nitrogen','Carbon Dioxide','Hydrogen'], answer: 2 },
  ],
};

// ── Init (run once on first load) ────────────────────────────────────────────
function initDB() {
  if (!DB.get('users'))       DB.set('users',       SEED_USERS);
  if (!DB.get('quizzes'))     DB.set('quizzes',     [SEED_QUIZ]);
  if (!DB.get('submissions')) DB.set('submissions', []);
}

// ── Auth Helpers ─────────────────────────────────────────────────────────────
function login(username, password, role) {
  const users = DB.get('users') || [];
  return users.find(u => u.username === username && u.password === password && u.role === role) || null;
}

function getSession() { return DB.get('session'); }
function setSession(user) { DB.set('session', user); }
function clearSession() { DB.remove('session'); }

function requireAuth(role) {
  const session = getSession();
  if (!session) { window.location.href = 'index.html'; return null; }
  if (role && session.role !== role) { window.location.href = session.role === 'teacher' ? 'teacher.html' : 'student.html'; return null; }
  return session;
}

// ── Quiz Helpers ─────────────────────────────────────────────────────────────
function getQuizzes()  { return DB.get('quizzes')     || []; }
function getSubmissions() { return DB.get('submissions') || []; }
function getUsers()    { return DB.get('users')        || []; }

function saveQuiz(quiz) {
  const all = getQuizzes();
  const idx = all.findIndex(q => q.id === quiz.id);
  if (idx >= 0) all[idx] = quiz; else all.push(quiz);
  DB.set('quizzes', all);
}

function deleteQuiz(id) {
  DB.set('quizzes',     getQuizzes().filter(q => q.id !== id));
  DB.set('submissions', getSubmissions().filter(s => s.quizId !== id));
}

function saveSubmission(sub) {
  const all = getSubmissions();
  all.push(sub);
  DB.set('submissions', all);
}

// ── Score Badge HTML ─────────────────────────────────────────────────────────
function scoreBadge(score) {
  const cls = score >= 80 ? 'badge-green' : score >= 60 ? 'badge-gold' : 'badge-red';
  return `<span class="badge ${cls}">${score}%</span>`;
}

// ── Date Formatter ───────────────────────────────────────────────────────────
function fmtDate(iso) {
  return new Date(iso).toLocaleDateString('en-PH', { year:'numeric', month:'short', day:'numeric' });
}

// ── Unique ID ────────────────────────────────────────────────────────────────
function uid(prefix) { return `${prefix}-${Date.now()}-${Math.floor(Math.random()*10000)}`; }
