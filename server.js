const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

const usersFilePath = path.join(__dirname, 'data', 'users.json');
const paymentsFilePath = path.join(__dirname, 'data', 'payments.json');

function loadUsers() {
  if (!fs.existsSync(usersFilePath)) {
    return [];
  }
  const data = fs.readFileSync(usersFilePath, 'utf8');
  return JSON.parse(data);
}

function loadPayments() {
  if (!fs.existsSync(paymentsFilePath)) {
    return [];
  }
  const data = fs.readFileSync(paymentsFilePath, 'utf8');
  return JSON.parse(data);
}

function savePayments(payments) {
  fs.writeFileSync(paymentsFilePath, JSON.stringify(payments, null, 2));
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const users = loadUsers();
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    req.session.loggedIn = true;
    req.session.username = username;
    res.redirect('/dashboard');
  } else {
    res.send('Neplatné přihlašovací údaje');
  }
});

app.get('/dashboard', (req, res) => {
  if (!req.session.loggedIn) {
    return res.redirect('/');
  }
  const payments = loadPayments();
  res.send(`
    <h1>Tabulka splátek</h1>
    <table>
      <tr><th>Týden</th><th>Částka (£)</th><th>Stav</th><th>Akce</th></tr>
      ${payments.map((payment, index) => `
        <tr>
          <td>${payment.week}</td>
          <td>${payment.amount}</td>
          <td>${payment.paid ? 'Zaplaceno' : 'Nezaplaceno'}</td>
          <td>
            <form action="/update-payment" method="POST">
              <input type="hidden" name="index" value="${index}">
              <input type="checkbox" name="paid" ${payment.paid ? 'checked' : ''}>
              <button type="submit">Upravit</button>
            </form>
          </td>
        </tr>
      `).join('')}
    </table>
    <a href="/logout">Odhlásit se</a>
  `);
});

app.post('/update-payment', (req, res) => {
  if (!req.session.loggedIn) {
    return res.redirect('/');
  }
  const { index, paid } = req.body;
  const payments = loadPayments();
  payments[index].paid = paid === 'on';
  savePayments(payments);
  res.redirect('/dashboard');
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

app.listen(port, () => {
  console.log(`Server běží na http://localhost:${port}`);
});
