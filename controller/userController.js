// ...existing code...
const express = require('express');
const router = express.Router();
const { register, login } = require('../service/userService');
const { generateToken } = require('../service/authService');
router.post('/register', (req, res) => {
  const { email, password } = req.body;
  const user = register(email, password);
  if (!user) return res.status(400).json({ error: 'Usuário já existe' });
  res.json({ id: user.id, email: user.email });
});
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = login(email, password);
  if (!user) return res.status(401).json({ error: 'Credenciais inválidas' });
  const token = generateToken(user);
  res.json({ token });
});
module.exports = router;
// ...existing code...
