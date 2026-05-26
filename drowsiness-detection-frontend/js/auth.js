// Simple localStorage-based auth (no backend needed for now)

function handleSignup() {
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const confirm = document.getElementById('confirm').value;
  const errorEl = document.getElementById('error-msg');
  const successEl = document.getElementById('success-msg');

  errorEl.classList.add('hidden');
  successEl.classList.add('hidden');

  if (!name || !email || !password || !confirm) {
    showError('All fields are required.'); return;
  }
  if (password.length < 6) {
    showError('Password must be at least 6 characters.'); return;
  }
  if (password !== confirm) {
    showError('Passwords do not match.'); return;
  }

  const users = JSON.parse(localStorage.getItem('dg_users') || '[]');
  if (users.find(u => u.email === email)) {
    showError('Account already exists with this email.'); return;
  }

  users.push({ name, email, password });
  localStorage.setItem('dg_users', JSON.stringify(users));

  successEl.textContent = '✅ Account created! Redirecting to login...';
  successEl.classList.remove('hidden');
  setTimeout(() => { window.location.href = '../index.html'; }, 1800);
}

function handleLogin() {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const errorEl = document.getElementById('error-msg');
  errorEl.classList.add('hidden');

  if (!email || !password) {
    showError('Please fill in all fields.'); return;
  }

  const users = JSON.parse(localStorage.getItem('dg_users') || '[]');
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    showError('Invalid email or password.'); return;
  }

  localStorage.setItem('dg_session', JSON.stringify({ name: user.name, email: user.email }));
  window.location.href = 'pages/dashboard.html';
}

function showError(msg) {
  const el = document.getElementById('error-msg');
  el.textContent = msg;
  el.classList.remove('hidden');
}