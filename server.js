/* -------------------------- ZÁKLAD -------------------------- */
const express = require('express');
const session = require('express-session');
const fs       = require('fs');
const path     = require('path');
const app  = express();
const PORT = 3000;

app.use(express.json());
app.use(session({
  secret: 'tajnyklic',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000*60*60 }   // 1 h
}));
app.use(express.static(path.join(__dirname, 'public')));

/* ----------------------- AUTENTIZACE ----------------------- */
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const users = JSON.parse(fs.readFileSync('users.json'));
  const user  = users.find(u => u.username === username && u.password === password);

  if (!user) return res.status(401).json({ error: 'Špatné přihlašovací údaje' });

  req.session.user = { username: user.username, role: user.role };
  res.json({ message: 'OK' });
});

app.post('/logout', (req, res) => {
  req.session.destroy(() => res.json({ message: 'Odhlášeno' }));
});

/* -------------------- POMOCNÝ MIDDLEWARE ------------------- */
function requireLogin(req, res, next) {
  if (req.session?.user) return next();
  res.status(401).json({ error: 'Nepřihlášený uživatel' });
}

/* ----------------------- API ENDPOINTY --------------------- */
// informace o přihlášeném uživateli
app.get('/api/user', requireLogin, (req, res) => res.json(req.session.user));

// seznam všech splátek
app.get('/api/payments', requireLogin, (req, res) => {
  const data = fs.readFileSync(path.join(__dirname, 'data', 'payments.json'));
  res.json(JSON.parse(data));
});

// aktualizace splátky (admin)
app.post('/api/payment-update', requireLogin, (req, res) => {
  const user = req.session.user;
  if (user.role !== 'admin') return res.status(403).json({ error: 'Jen pro admina' });

  const { id, amount, status } = req.body;
  const file = path.join(__dirname, 'data', 'payments.json');
  const payments = JSON.parse(fs.readFileSync(file));

  const p = payments.find(x => x.id === id);
  if (!p) return res.status(404).json({ error: 'Splátka nenalezena' });

  if (amount !== undefined) p.amount = Number(amount);
  if (status !== undefined) p.status = status;

  fs.writeFileSync(file, JSON.stringify(payments, null, 2));
  res.json({ message: 'Uloženo' });
});

/* -------------------- SERVER START ------------------------- */
app.listen(PORT, () => console.log(`▶ Server běží na http://localhost:${PORT}`));




function generateSchedule() {
  const start = new Date('2025-05-23');
  const week  = 1000*60*60*24*7;
  const out   = [];
  let total = 0, id = 1;
  while (total < 4000) {
    let amt = 150;
    if (total + amt > 4000) amt = 4000 - total;
    out.push({
      id,
      date: start.toLocaleDateString('cs-CZ'),
      amount: amt,
      status: 'nezaplaceno'
    });
    total += amt; id++; start.setTime(start.getTime() + week);
  }
  fs.writeFileSync('data/payments.json', JSON.stringify(out, null, 2));
}
*/
