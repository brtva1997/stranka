// server.js
import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import auth from './server/auth.js';
import payments from './server/payments.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Session nastavení
app.use(session({
  secret: 'tajne-heslo',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // true jen pokud máš HTTPS
}));

// Statické soubory (frontend)
app.use(express.static(path.join(__dirname, 'public')));

// API routery
app.use('/auth', auth);
app.use('/payments', payments);

// Spuštění serveru
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server běží na http://localhost:${PORT}`);
});
