
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

app.get('/api/payments', (req, res) => {
    const data = JSON.parse(fs.readFileSync('data.json', 'utf-8'));
    res.json(data);
});

app.post('/api/payments', (req, res) => {
    fs.writeFileSync('data.json', JSON.stringify(req.body, null, 2), 'utf-8');
    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`Server běží na http://localhost:${PORT}`);
});
