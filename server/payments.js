import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, 'data.json');

router.get('/', async (req, res) => {
  try {
    const data = await fs.readFile(dataPath, 'utf-8');
    res.json(JSON.parse(data));
  } catch (err) {
    res.status(500).json({ error: 'Chyba při načítání splátek' });
  }
});

router.post('/update', async (req, res) => {
  try {
    const { index, amount, paid } = req.body;
    const data = JSON.parse(await fs.readFile(dataPath, 'utf-8'));

    if (amount !== null) data.payments[index].amount = amount;
    if (paid !== null) data.payments[index].paid = paid;

    await fs.writeFile(dataPath, JSON.stringify(data, null, 2));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Nepodařilo se uložit změny' });
  }
});

export default router;
