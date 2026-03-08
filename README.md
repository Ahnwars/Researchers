<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>EduQuest — Login</title>
  <link rel="stylesheet" href="css/style.css"/>
</head>
<body>
  <div class="login-page">
    <div class="login-card">

      <div class="login-logo">
        <div class="login-logo-mark">🎓</div>
        <h1 class="login-title">EduQuest</h1>
        <p class="login-sub">Intelligent Learning Platform</p>
      </div>

      <!-- Role Tabs -->
      <div class="tabs" style="margin-bottom:24px">
        <button class="tab-btn active" data-role="student"  onclick="setRole('student')">Student</button>
        <button class="tab-btn"        data-role="teacher"  onclick="setRole('teacher')">Teacher</button>
      </div>

      <div id="error-box" class="error-box hidden"></div>

      <div class="form-group">
        <label class="field-label" for="username">Username</label>
        <input type="text" id="username" placeholder="Enter your username" autocomplete="username"/>
      </div>

      <div class="form-group">
        <label class="field-label" for="password">Password</label>
        <input type="password" id="password" placeholder="••••••••" autocomplete="current-password"/>
      </div>

      <button class="btn btn-primary btn-full" onclick="handleLogin()">
        Sign in as <span id="role-label">Student</span>
      </button>

      <div class="demo-box">
        <strong>Demo accounts</strong><br>
        Teacher: &nbsp;<code>teacher / teacher123</code><br>
        Student 1: <code>student1 / pass123</code><br>
        Student 2: <code>student2 / pass123</code>
      </div>

    </div>
  </div>

  <script src="js/db.js"></script>
  <script>
    initDB();

    // Redirect if already logged in
    const session = getSession();
    if (session) {
      window.location.href = session.role === 'teacher' ? 'teacher.html' : 'student.html';
    }

    let currentRole = 'student';

    function setRole(role) {
      currentRole = role;
      document.getElementById('role-label').textContent = role === 'teacher' ? 'Teacher' : 'Student';
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.role === role));
      hideError();
    }

    function showError(msg) {
      const el = document.getElementById('error-box');
      el.textContent = msg;
      el.classList.remove('hidden');
    }
    function hideError() {
      document.getElementById('error-box').classList.add('hidden');
    }

    function handleLogin() {
      hideError();
      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value;

      if (!username || !password) { showError('Please enter your username and password.'); return; }

      const user = login(username, password, currentRole);
      if (!user) { showError('Incorrect username or password. Please try again.'); return; }

      setSession(user);
      window.location.href = user.role === 'teacher' ? 'teacher.html' : 'student.html';
    }

    // Allow Enter key
    document.addEventListener('keydown', e => { if (e.key === 'Enter') handleLogin(); });
  </script>
</body>
</html>
