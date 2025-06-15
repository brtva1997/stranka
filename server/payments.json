import express from 'express';
import fs from 'fs';
const router = express.Router();

const file = './server/data.json';

router.get('/', (req, res) => {
  const data = JSON.parse(fs.readFileSync(file));
  res.json(data);
});

router.post('/update', (req, res) => {
  const { index, amount, paid } = req.body;
  const data = JSON.parse(fs.readFileSync(file));
  data.payments[index].amount = amount;
  data.payments[index].paid = paid;
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
  res.json({ success: true });
});

export default router;
