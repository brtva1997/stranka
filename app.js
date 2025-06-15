import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import auth from './server/auth.js';
import payments from './server/payments.js';

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

app.use('/auth', auth);
app.use('/payments', payments);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server běží na http://localhost:${PORT}`);
});
