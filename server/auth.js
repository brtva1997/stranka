import express from 'express';
const router = express.Router();

const USERS = {
  user: 'userpass',
  admin: 'adminpass'
};

router.post('/', (req, res) => {
  const { username, password } = req.body;
  if (USERS[username] === password) {
    res.json({ role: username });
  } else {
    res.status(401).json({ error: 'Neplatné přihlášení' });
  }
});

export default router;
