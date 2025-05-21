const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

const splatkyPath = path.join(__dirname, 'splatky.json');

function nactiSplatky() {
  const data = fs.readFileSync(splatkyPath, 'utf8');
  return JSON.parse(data);
}

function ulozSplatky(splatky) {
  fs.writeFileSync(splatkyPath, JSON.stringify(splatky, null, 2));
}

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'tajnyKlic',
  resave: false,
  saveUninitialized: true
}));

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="cs">
    <head>
      <meta charset="UTF-8" />
      <title>Přihlášení</title>
      <link rel="stylesheet" href="/style.css">
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet">
    </head>
    <body>
      <div class="login-container">
        <h2>Přihlášení</h2>
        <form method="POST" action="/login">
          <input type="text" name="username" placeholder="Uživatelské jméno" required />
          <input type="password" name="password" placeholder="Heslo" required />
          <button type="submit">Přihlásit se</button>
        </form>
      </div>
    </body>
    </html>
  `);
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if ((username === 'test' && password === 'test!') || (username === 'admin' && password === 'admin')) {
    req.session.username = username;
    res.redirect('/splatky');
  } else {
    res.status(401).send('Neplatné přihlašovací údaje.');
  }
});

app.get('/splatky', (req, res) => {
  if (!req.session.username) {
    return res.redirect('/');
  }

  const splatky = nactiSplatky();
  const isAdmin = req.session.username === 'admin';

  let rows = splatky.map(splatka => `
    <tr>
      <td>${splatka.cislo}</td>
      <td>
        ${isAdmin ? `<input type="number" name="castka_${splatka.cislo}" value="${splatka.castka}" required />` : `${splatka.castka}`}
      </td>
      <td>${splatka.datum}</td>
    </tr>
  `).join('');

  res.send(`
    <!DOCTYPE html>
    <html lang="cs">
    <head>
      <meta charset="UTF-8" />
      <title>Tabulka splátek</title>
      <link rel="stylesheet" href="/style.css">
    </head>
    <body>
      <h2>Tabulka splátek</h2>
      <form method="POST" action="/splatky">
        <table>
          <tr>
            <th>Číslo splátky</th>
            <th>Částka (GBP)</th>
            <th>Datum splatnosti</th>
          </tr>
          ${rows}
        </table>
        ${isAdmin ? '<button type="submit" class="submit-btn">Uložit změny</button>' : ''}
      </form>
    </body>
    </html>
  `);
});

app.post('/splatky', (req, res) => {
  if (req.session.username === 'admin') {
    const splatky = nactiSplatky();
    const updatedSplatky = splatky.map(splatka => {
      const novaCastka = parseFloat(req.body[`castka_${splatka.cislo}`]);
      return {
        ...splatka,
        castka: isNaN(novaCastka) ? splatka.castka : novaCastka
      };
    });
    ulozSplatky(updatedSplatky);
    res.redirect('/splatky');
  } else {
    res.status(403).send('Přístup odepřen.');
  }
});

app.listen(PORT, () => {
  console.log(`Server běží na http://localhost:${PORT}`);
});
