import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const filePath = path.join(__dirname, 'data.json');

// Vrací seznam splátek
router.get('/', (req, res) => {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  res.json(data);
});

// Aktualizuje konkrétní splátku (dle indexu)
router.post('/update', (req, res) => {
  const { index, amount, paid } = req.body;
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  if (data.payments[index]) {
    data.payments[index].amount = amount;
    data.payments[index].paid = paid;
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    res.json({ success: true });
  } else {
    res.status(400).json({ error: 'Neplatný index' });
  }
});

export default router;
