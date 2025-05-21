const express = require('express');
const fs = require('fs');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

const usersFile = path.join(__dirname, 'data', 'users.json');
const paymentsFile = path.join(__dirname, 'data', 'payments.json');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

app.use(session({
  secret: 'tajne-heslo',
  resave: false,
  saveUninitialized: true,
}));

// === Pomocné funkce ===
function readJSON(filePath) {
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJSON(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// === Vytvoření payments.json jen jednou ===
if (!fs.existsSync(paymentsFile)) {
  generatePayments();
}

function generatePayments() {
  const startDate = new Date('2025-05-21');
  let total = 0;
  const payments = [];

  let id = 1;
  payments.push({
    id: id++,
    week: '2025-05-21',
    amount: 500,
    label: '',
    includeInTotal: false,
    paid: false
  });

  payments.push({
    id: id++,
    week: '2025-05-21',
    amount: 503,
    label: '',
    includeInTotal: true,
    paid: false
  });

  total += 503;
  let currentDate = new Date('2025-05-28');

  while (total < 4000) {
    const amount = 225;
    const isFirstWeek = new Date(currentDate).getDate() <= 7;

    payments.push({
      id: id++,
      week: currentDate.toISOString().split('T')[0],
      amount: amount,
      label: isFirstWeek ? 'nájem' : '',
      includeInTotal: !isFirstWeek,
      paid: false
    });

    if (!isFirstWeek) total += amount;
    currentDate.setDate(currentDate.getDate() + 7);
  }

  writeJSON(paymentsFile, payments);
}

// === Autentifikace ===
app.post('/login', (req, res) => {
  const users = readJSON(usersFile);
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    req.session.user = { username: user.username, role: user.role };
    res.redirect('/dashboard.html');
  } else {
    res.send('Špatné přihlašovací údaje');
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/login.html'));
});

// === API pro načtení plateb ===
app.get('/api/payments', (req, res) => {
  if (!req.session.user) return res.status(401).send('Neautorizováno');

  const payments = readJSON(paymentsFile);
  const paidTotal = payments
    .filter(p => p.includeInTotal && p.paid)
    .reduce((sum, p) => sum + p.amount, 0);

  res.json({ payments, paidTotal, user: req.session.user });
});

// === API pro admin úpravu plateb ===
app.post('/api/update-payment', (req, res) => {
  if (!req.session.user || req.session.user.role !== 'admin') {
    return res.status(403).send('Přístup zamítnut');
  }

  const { id, paid } = req.body;
  const payments = readJSON(paymentsFile);
  const index = payments.findIndex(p => p.id === id);

  if (index !== -1) {
    payments[index].paid = paid;
    writeJSON(paymentsFile, payments);
    res.json({ success: true });
  } else {
    res.status(404).json({ success: false });
  }
});

app.listen(PORT, () => console.log(`Server běží na http://localhost:${PORT}`));
