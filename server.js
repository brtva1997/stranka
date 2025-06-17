import express from 'express';
import payments from './server/payments.js';
import auth from './server/auth.js';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use('/payments', payments);
app.use('/auth', auth);
app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
  console.log(`Server běží na http://localhost:${port}`);
});
