const express  = require('express');
const session  = require('express-session');
const fs       = require('fs');
const path     = require('path');
const bodyParser = require('body-parser');

const app  = express();
const PORT = 3000;

// ---------- cesty k souborům ----------
const DATA_DIR       = path.join(__dirname, 'data');
const USERS_FILE     = path.join(DATA_DIR, 'users.json');
const PAYMENTS_FILE  = path.join(DATA_DIR, 'payments.json');

// ---------- middleware ----------
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'super-tajny-klic',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, secure: false }
}));
app.use(express.static(path.join(__dirname, 'public')));

// ---------- helpery ----------
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function loadJSON(filePath, fallback) {
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }
  fs.writeFileSync(filePath, JSON.stringify(fallback, null, 2));
  return fallback;
}

function generatePayments() {
  const start = new Date('2025-04-18');
  const total = 4000;
  const weekly = 200;
  const count = total / weekly;        // 20 týdnů
  const arr = [];
  for (let i = 0; i < count; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i * 7);
    arr.push({
      id:     i + 1,
      week:   d.toISOString().split('T')[0],
      amount: weekly,
      paid:   false
    });
  }
  return arr;
}

ensureDataDir();

// ---------- data ----------
const users    = loadJSON(USERS_FILE, [
  { "username": "admin", "password": "admin", "role": "admin" },
  { "username": "user",  "password": "user",  "role": "user"  }
]);
let payments   = loadJSON(PAYMENTS_FILE, generatePayments());

// ---------- middleware auth ----------
function isLogged(req, res, next) {
  if (req.session.user) return next();
  res.redirect('/');
}

// ---------- routy ----------
app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.send('Neplatné přihlášení');

  req.session.user = { username: user.username, role: user.role };
  res.redirect('/dashboard');
});

app.get('/dashboard', isLogged, (req, res) => {
  const { role, username } = req.session.user;
  const totalPaid = payments.filter(p => p.paid).reduce((s, p) => s + p.amount, 0);

  // řádky tabulky
  const rows = payments.map(p => `
    <tr>
      <td>${p.week}</td>
      <td>£${p.amount}</td>
      <td>${role === 'admin'
        ? `<input type="checkbox" name="paid_${p.id}" ${p.paid ? 'checked' : ''}>`
        : (p.paid ? '✓ Zaplaceno' : '✗ Nezaplaceno')}</td>
    </tr>
  `).join('');

  const formOpen  = role === 'admin' ? '<form method="POST" action="/update">' : '';
  const formClose = role === 'admin' ? '<button class="submit-btn" type="submit">💾 Uložit</button></form>' : '';

  res.send(`
    <!DOCTYPE html><html lang="cs"><head>
    <meta charset="UTF-8"><title>Splátky</title>
    <link rel="stylesheet" href="/css/style.css"></head><body>
    <div class="dash-container">
      <h2>Ahoj, ${username}</h2>
      <p class="total-paid">Celkem splaceno: £${totalPaid}</p>
      ${formOpen}
      <table>
        <thead><tr><th>Datum</th><th>Částka</th><th>Status</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      ${formClose}
      <a class="logout" href="/logout">Odhlásit se</a>
    </div>
    </body></html>
  `);
});

app.post('/update', isLogged, (req, res) => {
  if (req.session.user.role !== 'admin') return res.status(403).send('Forbidden');

  payments = payments.map(p => ({
    ...p,
    paid: req.body[`paid_${p.id}`] === 'on'
  }));
  fs.writeFileSync(PAYMENTS_FILE, JSON.stringify(payments, null, 2));
  res.redirect('/dashboard');
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/'));
});

// ---------- spuštění ----------
app.listen(PORT, () => console.log(`⬢ Server běží: http://localhost:${PORT}`));
