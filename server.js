const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if ((username === 'test' && password === 'test!') || (username === 'admin' && password === 'admin')) {
    res.send('Přihlášení úspěšné!');
  } else {
    res.status(401).send('Neplatné přihlašovací údaje.');
  }
});

app.listen(PORT, () => {
  console.log(`Server běží na http://localhost:${PORT}`);
});
