// server.js
const express = require('express');
const app = express();
const path = require('path');

const port = process.env.PORT || 3000;

// Slouží statický obsah ze složky s tvými soubory
app.use(express.static(path.join(__dirname)));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server běží na http://localhost:${port}`);
});
