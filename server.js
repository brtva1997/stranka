const express = require('express');
const app = express();
const path = require('path');

const port = process.env.PORT || 3000;

// Slouží statické soubory z ./public
app.use(express.static(path.join(__dirname, 'public')));

// Při jakémkoli jiném požadavku vrátí index.html z ./public
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server běží na http://localhost:${port}`);
});
