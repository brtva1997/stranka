
const session = require('express-session');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

/* --------------------- MIDDLEWARE --------------------- */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'tajnyklic',
  resave: false,
  saveUninitialized: false
}));
app.use(express.static(path.join(__dirname, 'public')));   // ➜ index.html bude root

/* --------- Ověření přihlášení (middleware) ----------- */
function requireLogin(req, res, next) {
  if (req.session?.user) return next();
  res.status(401).json({ error: 'Nepřihlášený uživatel' });
}

/* --------------------- AUTH API ----------------------- */
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const users = JSON.parse(fs.readFileSync('data/users.json'));
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) return res.status(401).json({ error: 'Neplatné přihlašovací údaje' });

  req.session.user = { username: user.username, role: user.role };
  res.json({ success: true });
});

app.post('/logout', (req, res) => {
  req.session.destroy(() => res.json({ success: true }));
});

/* --------------------- DATA API ----------------------- */
app.get('/api/user', requireLogin, (req, res) => res.json(req.session.user));

app.get('/api/payments', requireLogin, (req, res) => {
  const payments = JSON.parse(fs.readFileSync('data/payments.json'));
  res.json(payments);
});

app.post('/api/payment-update', requireLogin, (req, res) => {
  if (req.session.user.role !== 'admin')
    return res.status(403).json({ error: 'Jen pro admina' });

  const { id, status, amount } = req.body;
  const file = 'data/payments.json';
  const payments = JSON.parse(fs.readFileSync(file));

  const p = payments.find(x => x.id === id);
  if (!p) return res.status(404).json({ error: 'Splátka nenalezena' });

  if (status) p.status = status;
  if (amount !== undefined) p.amount = Number(amount);

  fs.writeFileSync(file, JSON.stringify(payments, null, 2));
  res.json({ success: true });
});

app.get('/api/summary', requireLogin, (req, res) => {
  const payments = JSON.parse(fs.readFileSync('data/payments.json'));
  const paid = payments
    .filter(p => p.status === 'zaplaceno' && p.type !== 'nájem')
    .reduce((s, p) => s + p.amount, 0);
  res.json({ total: 4000, remaining: 4000 - paid });
});

/* ------- (jednorázově) GENERÁTOR SPLÁTEK -------------- */
/*
generateSchedule();
*/
function generateSchedule() {
  const start = new Date('2025-05-23');
  const week = 7 * 24 * 60 * 60 * 1000;
  const payments = [];
  let total = 0, id = 1, date = new Date(start);

  while (total < 4000) {
    const firstWeek = date.getDate() <= 7;
    const isRent = firstWeek;
    const amount = isRent ? 225 : 150;

    payments.push({
      id: id++,
      date: date.toLocaleDateString('cs-CZ'),
      amount,
      status: 'nezaplaceno',
      type: isRent ? 'nájem' : 'splátka'
    });

    if (!isRent) total += amount;
    date = new Date(date.getTime() + week);
  }
  fs.writeFileSync('data/payments.json', JSON.stringify(payments, null, 2));
}

/* -------------------- START --------------------------- */
app.listen(PORT, () =>
  console.log(`▶ Server běží na http://localhost:${PORT}`)
);
/* ---------- VYTVOŘENÍ SPLÁTKY --------------- */
app.post('/api/payment-create', requireLogin, (req, res) => {
  if (req.session.user.role !== 'admin')
    return res.status(403).json({ error: 'Jen pro admina' });

  const { date, amount, type } = req.body;
  if (!date || !amount) return res.status(400).json({ error: 'Chybí date/amount' });

  const file = 'data/payments.json';
  const payments = JSON.parse(fs.readFileSync(file));

  const newId = payments.reduce((m,p)=>p.id>m?p.id:m, 0) + 1;
  payments.push({
    id: newId,
    date,
    amount: Number(amount),
    status: 'nezaplaceno',
    type: type || 'splátka'
  });

  fs.writeFileSync(file, JSON.stringify(payments, null, 2));
  res.json({ success: true, id: newId });
});

/* ------------- SMAZÁNÍ SPLÁTKY --------------- */
app.post('/api/payment-delete', requireLogin, (req, res) => {
  if (req.session.user.role !== 'admin')
    return res.status(403).json({ error: 'Jen pro admina' });

  const { id } = req.body;
  const file = 'data/payments.json';
  let payments = JSON.parse(fs.readFileSync(file));
  const before = payments.length;

  payments = payments.filter(p => p.id !== Number(id));

  if (payments.length === before)
    return res.status(404).json({ error: 'Splátka nenalezena' });

  fs.writeFileSync(file, JSON.stringify(payments, null, 2));
  res.json({ success: true });
});

