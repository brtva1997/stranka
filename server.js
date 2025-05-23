const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  secret: 'tajnyklic',
  resave: false,
  saveUninitialized: true
}));
app.use(express.static(path.join(__dirname, 'public')));

// Middleware pro ověření přihlášení
function requireLogin(req, res, next) {
  if (req.session && req.session.user) {
    next();
  } else {
    res.status(401).json({ error: 'Nepřihlášený uživatel' });
  }
}

// Přihlášení
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const users = JSON.parse(fs.readFileSync('data/users.json'));
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    req.session.user = { username: user.username, role: user.role };
    res.json({ success: true });
  } else {
    res.status(401).json({ error: 'Neplatné přihlašovací údaje' });
  }
});

// Odhlášení
app.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

// Získání informací o přihlášeném uživateli
app.get('/api/user', requireLogin, (req, res) => {
  res.json(req.session.user);
});

// Získání seznamu plateb
app.get('/api/payments', requireLogin, (req, res) => {
  const payments = JSON.parse(fs.readFileSync('data/payments.json'));
  res.json(payments);
});

// Aktualizace stavu platby
app.post('/api/payment-update', requireLogin, (req, res) => {
  if (req.session.user.role !== 'admin') {
    return res.status(403).json({ error: 'Přístup odepřen' });
  }

  const { id, status } = req.body;
  const payments = JSON.parse(fs.readFileSync('data/payments.json'));
  const payment = payments.find(p => p.id === id);
  if (payment) {
    payment.status = status;
    fs.writeFileSync('data/payments.json', JSON.stringify(payments, null, 2));
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Platba nenalezena' });
  }
});

// Získání souhrnu splátek
app.get('/api/summary', requireLogin, (req, res) => {
  const payments = JSON.parse(fs.readFileSync('data/payments.json'));
  const paid = payments
    .filter(p => p.status === 'zaplaceno' && p.type !== 'nájem')
    .reduce((sum, p) => sum + p.amount, 0);
  res.json({ total: 4000, remaining: 4000 - paid });
});

// Generování splátkového kalendáře
function generateSchedule() {
  const start = new Date('2025-05-23');
  const week = 1000 * 60 * 60 * 24 * 7;
  const payments = [];
  let total = 0;
  let id = 1;
  let currentDate = new Date(start);

  while (total < 4000) {
    const isFirstWeek = currentDate.getDate() <= 7;
    const isRent = isFirstWeek;
    const amount = isRent ? 225 : 150;

    payments.push({
      id: id++,
      date: currentDate.toLocaleDateString('cs-CZ'),
      amount: amount,
      status: 'nezaplaceno',
      type: isRent ? 'nájem' : 'splátka'
    });

    if (!isRent) {
      total += amount;
    }

    currentDate.setTime(currentDate.getTime() + week);
  }

  fs.writeFileSync('data/payments.json', JSON.stringify(payments, null, 2));
}

// Spuštění serveru
app.listen(PORT, () => {
  console.log(`Server běží na http://localhost:${PORT}`);
  // generateSchedule(); // Okomentuj po prvním spuštění, aby se nepřepisoval payments.json
});
