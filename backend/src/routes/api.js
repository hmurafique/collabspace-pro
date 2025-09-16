import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Health
router.get('/health', (req, res) => res.json({ ok: true }));

// Demo register/login (in-memory for demo)
const users = [];

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if(!username || !password) return res.status(400).json({ error: 'Missing' });
  const exists = users.find(u => u.username === username);
  if (exists) return res.status(400).json({ error: 'exists' });
  const hash = await bcrypt.hash(password, 10);
  const user = { id: users.length+1, username, password: hash };
  users.push(user);
  res.status(201).json({ id: user.id, username: user.username });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (!user) return res.status(400).json({ error: 'invalid' });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(400).json({ error: 'invalid' });
  const token = jwt.sign({ id: user.id, username }, process.env.JWT_SECRET || 'dev', { expiresIn: '8h' });
  res.json({ token });
});

export default router;
