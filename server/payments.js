import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const filePath = path.join(__dirname, 'data.json');

router.get('/', (req, res) => {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  res.json(data);
});

export default router;
