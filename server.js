const express = require('express');
const session = require('express-session');
const fs = require('fs');
const path = require('path');
const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'tajnyklic',
  resave: false,
  saveUninitialized: true
}));

// Načtení nebo vytvoření splátkového kalendáře
const paymentsFile = path.join(__dirname, 'data', 'payments.json');
let payments = [];

function generatePayments() {
  const startDate = new Date('2025-04-18');
  const totalAmount = 4000;
  const weeklyAmount = 200;
  const numberOfPayments = totalAmount / weeklyAmount;
  const generatedPayments = [];

  for (let i = 0; i < numberOfPayments; i++) {
    const dueDate = new Date(startDate);
    dueDate.setDate(startDate.getDate() + i * 7);
    generatedPayments.push({
      id: i + 1,
      dueDate: dueDate.toISOString().split('T')[0],
      amount: weeklyAmount,
      paid: false
    });
  }

  return generatedPayments;
}

if (fs.existsSync(paymentsFile)) {
  payments = JSON.parse(fs.readFileSync(paymentsFile));
} else {
  payments = generatePayments();
  fs.writeFileSync(paymentsFile, JSON.stringify(payments, null, 2));
}

// Přihlašovací stránka
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Přihlášení
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  // Jednoduché ověření uživatele
  if (username === 'admin' && password === 'admin') {
    req.session.user = { username, role: 'admin' };
    res.redirect('/dashboard');
  } else if (username === 'user' && password === 'user') {
    req.session.user = { username, role: 'user' };
    res.redirect('/dashboard');
  } else {
    res.send('Neplatné přihlašovací údaje.');
  }
});

// Ověření přihlášení
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/');
  }
}

// Dashboard
app.get('/dashboard', isAuthenticated, (req, res) => {
  const user = req.session.user;
  let tableRows = '';

  payments.forEach(payment => {
    tableRows += `
      <tr>
        <td>${payment.dueDate}</td>
        <td>£${payment.amount}</td>
        <td>
          ${user.role === 'admin' ? `
            <input type="checkbox" name="paid_${payment.id}" ${payment.paid ? 'checked' : ''}>
          ` : `
            ${payment.paid ? 'Zaplaceno' : 'Nezaplaceno'}
          `}
        </td>
      </tr>
    `;
  });

  const formStart = user.role === 'admin' ? '<form method="POST" action="/update-payments">' : '';
  const formEnd = user.role === 'admin' ? '<button type="submit" class="submit-btn">Uložit změny</button></form>' : '';

  res.send(`
    <!DOCTYPE html>
    <html lang="cs">
    <head>
      <meta charset="UTF-8">
      <title>Splátkový kalendář</title>
      <link rel="stylesheet" href="/style.css">
    </head>
    <body>
      <h2>Vítej, ${user.username}</h2>
      ${formStart}
      <table>
        <tr>
          <th>Datum splatnosti</th>
          <th>Částka</th>
          <th>Status</th>
        </tr>
        ${tableRows}
      </table>
      ${formEnd}
    </body>
    </html>
  `);
});

// Aktualizace splátek
app.post('/update-payments', isAuthenticated, (req, res) => {
  if (req.session.user.role !== 'admin') {
    return res.status(403).send('Přístup odepřen.');
  }

  payments = payments.map(payment => {
    return {
      ...payment,
      paid: req.body[`paid_${payment.id}`] === 'on'
    };
  });

  fs.writeFileSync(paymentsFile, JSON.stringify(payments, null, 2));
  res.redirect('/dashboard');
});

// Odhlášení
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

// Spuštění serveru
app.listen(3000, () => {
  console.log('Server běží na http://localhost:3000');
});
