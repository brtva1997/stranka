const express = require('express');
const session = require('express-session');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

const USERS_FILE = path.join(__dirname, 'data', 'users.json');
const PAYMENTS_FILE = path.join(__dirname, 'data', 'payments.json');

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'tajnyklic',
  resave: false,
  saveUninitialized: false
}));

// Pomocné funkce
function loadUsers() {
  const data = fs.readFileSync(USERS_FILE);
  return JSON.parse(data);
}

function loadPayments() {
  const data = fs.readFileSync(PAYMENTS_FILE);
  return JSON.parse(data);
}

function savePayments(payments) {
  fs.writeFileSync(PAYMENTS_FILE, JSON.stringify(payments, null, 2));
}

function getPaidTotal(payments) {
  return payments.reduce((sum, p) =>
    p.paid && p.includeInTotal ? sum + p.amount : sum
  , 0);
}

// Přihlašování
app.get('/', (req, res) => {
  if (req.session.user) {
    res.redirect('/dashboard');
  } else {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
  }
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const users = loadUsers();

  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    req.session.user = user;
    res.redirect('/dashboard');
  } else {
    res.send('Špatné přihlašovací údaje. <a href="/">Zkusit znovu</a>');
  }
});

// Dashboard
app.get('/dashboard', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/');
  }
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/api/payments', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Nepřihlášený uživatel' });
  }
  const payments = loadPayments();
  const paidTotal = getPaidTotal(payments);
  res.json({ payments, paidTotal, user: req.session.user });
});

app.post('/api/update-payment', (req, res) => {
  if (!req.session.user || req.session.user.role !== 'admin') {
    return res.status(403).json({ error: 'Přístup zamítnut' });
  }

  const { id, paid } = req.body;
  const payments = loadPayments();
  const payment = payments.find(p => p.id === id);

  if (payment) {
    payment.paid = paid;
    savePayments(payments);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Platba nenalezena' });
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

// Spuštění
app.listen(PORT, () => {
  console.log(`Server běží na http://localhost:${PORT}`);
});
