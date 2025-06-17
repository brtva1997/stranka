import express from 'express';
const router = express.Router();

const users = {
  admin: { password: 'admin', role: 'admin' },
  asd: { password: 'asd', role: 'user' }
};

router.post('/', (req, res) => {
  const { username, password } = req.body;
  const user = users[username];
  if (user && user.password === password) {
    res.json({ role: user.role });
  } else {
    res.status(401).json({ error: 'Neplatné údaje' });
  }
});

export default router;
