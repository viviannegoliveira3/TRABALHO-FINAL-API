// ...existing code...
const express = require('express');
const router = express.Router();
const { checkout } = require('../service/checkoutService');
const { verifyToken } = require('../service/authService');
router.post('/', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const payload = verifyToken(token);
  if (!payload) return res.status(401).json({ error: 'Token inválido' });
  const { items, payment } = req.body;
  if (!items || !payment) return res.status(400).json({ error: 'Dados incompletos' });
  const result = checkout({ userId: payload.id, items, payment });
  if (result.error) return res.status(400).json(result);
  res.json(result);
});
module.exports = router;
// ...existing code...
