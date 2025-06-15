import express from 'express';
import fs from 'fs/promises';

const router = express.Router();
const file = new URL('./data.json', import.meta.url);

router.get('/', async (req, res) => {
  try {
    const data = JSON.parse(await fs.readFile(file));
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Chyba při čtení dat.' });
  }
});

router.post('/update', async (req, res) => {
  try {
    const { index, amount, paid } = req.body;
    const data = JSON.parse(await fs.readFile(file));

    if (amount !== null) data.payments[index].amount = amount;
    if (paid !== null) data.payments[index].paid = paid;

    await fs.writeFile(file, JSON.stringify(data, null, 2));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Chyba při ukládání.' });
  }
});

export default router;
