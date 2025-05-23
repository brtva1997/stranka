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
  saveUninitialized: false
}));

const readJSON = fp => fs.existsSync(fp) ? JSON.parse(fs.readFileSync(fp, 'utf8')) : [];
const writeJSON = (fp, data) => fs.writeFileSync(fp, JSON.stringify(data, null, 2));

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = readJSON(usersFile).find(u => u.username === username && u.password === password);
  if (!user) return res.send('Špatné přihlášení');
  req.session.user = user;
  res.redirect('/dashboard.html');
});

app.get('/logout', (req, res) => req.session.destroy(() => res.redirect('/index.html')));

app.get('/api/payments', (req, res) => {
  if (!req.session.user) return res.status(401).end();
  const payments = readJSON(paymentsFile);
  const paidTotal = payments.filter(p => p.includeInTotal && p.paid)
                            .reduce((sum, p) => sum + p.amount, 0);
  res.json({ payments, paidTotal, user: req.session.user });
});

app.post('/api/update-payment', (req, res) => {
  if (!req.session.user || req.session.user.role !== 'admin') return res.status(403).end();
  const { id, paid } = req.body;
  const payments = readJSON(paymentsFile);
  const pay = payments.find(p => p.id === id);
  if (pay) {
    pay.paid = paid;
    writeJSON(paymentsFile, payments);
    return res.json({ success: true });
  }
  res.status(404).end();
});

app.listen(PORT, () => console.log(`Server běží na http://localhost:${PORT}`));
