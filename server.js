const express = require('express');
const session = require('express-session');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static('public'));

app.use(session({
  secret: 'tajnyklic',
  resave: false,
  saveUninitialized: false,
}));

function loadUsers() {
    return JSON.parse(fs.readFileSync('./users.json', 'utf-8'));
}

function loadPayments() {
    return JSON.parse(fs.readFileSync('./data/payments.json', 'utf-8'));
}

function savePayments(payments) {
    fs.writeFileSync('./data/payments.json', JSON.stringify(payments, null, 2), 'utf8');
}

function requireLogin(req, res, next) {
    if (!req.session.user) return res.status(401).json({error: "not authenticated"});
    next();
}

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const users = loadUsers();
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        req.session.user = { username: user.username, role: user.role };
        res.json({success: true, role: user.role});
    } else {
        res.status(401).json({success: false, message:"Bad credentials"});
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy(() => res.json({success:true}));
});

app.get('/api/user', requireLogin, (req, res) => {
    res.json(req.session.user);
});

app.get('/api/payments', requireLogin, (req, res) => {
    // Vrací pouze platby přihlášeného uživatele
    const all = loadPayments();
    const user = req.session.user.username;
    res.json(all.filter(p => p.username === user));
});

app.post('/api/payment-update', requireLogin, (req, res) => {
    if (req.session.user?.role !== 'admin') return res.status(403).json({error: "nepovolené"});
    const { id, paid } = req.body;
    const payments = loadPayments();
    let found = false;
    payments.forEach(p => {
        if (p.id === id) { p.paid = paid; found = true; }
    });
    if(found){
        savePayments(payments);
        res.json({success:true});
    }else{
        res.status(404).json({success:false, message:"Platba nenalezena"});
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log("Server běží na http://localhost:" + PORT));
