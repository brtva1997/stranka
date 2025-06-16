// server/payments.js

import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

// Cesta k souboru data.json
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, 'data.json');

// GET: Vrací všechny splátky
router.get('/', async (req, res) => {
  try {
    const raw = await fs.readFile(dataPath, 'utf-8');
    const data = JSON.parse(raw);
    res.json(data);
  } catch (err) {
    console.error('Chyba při načítání splátek:', err.message);
    res.status(500).json({ error: 'Nepodařilo se načíst data.' });
  }
});

// POST: Aktualizuje jednu splátku (částka nebo stav splacení)
router.post('/update', async (req, res) => {
  try {
    const { index, amount, paid } = req.body;
    const raw = await fs.readFile(dataPath, 'utf-8');
    const data = JSON.parse(raw);

    if (!data.payments[index]) {
      return res.status(400).json({ error: 'Neplatný index splátky.' });
    }

    if (amount !== null && typeof amount === 'number') {
      data.payments[index].amount = amount;
    }

    if (typeof paid === 'boolean') {
      data.payments[index].paid = paid;
    }

    await fs.writeFile(dataPath, JSON.stringify(data, null, 2));
    res.json({ success: true });
  } catch (err) {
    console.error('Chyba při ukládání splátek:', err.message);
    res.status(500).json({ error: 'Nepodařilo se aktualizovat data.' });
  }
});

export default router;
