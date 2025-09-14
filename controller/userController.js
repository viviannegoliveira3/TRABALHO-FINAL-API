// ...existing code...
const userService = require('../../src/services/userService');
const express = require('express');
const router = express.Router();
const { register, login } = require('../service/userService');
const { generateToken } = require('../service/authService');
router.post('/register', (req, res) => {


exports.register = (req, res) => {
  const { name, email, password } = req.body;
  const user = userService.registerUser(name, email, password);
  if (!user) return res.status(400).json({ error: 'Email já cadastrado' });
  res.status(201).json({ user });
};

exports.login = (req, res) => {

const { email, password } = req.body;
const result = userService.authenticate(email, password);
if (!result) return res.status(401).json({ error: 'Credenciais inválidas' });
res.json(result);
};


router.post ('/login', (req, res) => {
  const { email, password } = req.body;
  const user = login(email,password);
  if (!user) return res.status(401).json ({ error: 'Credenciais inválidas'});
  const token = generateToken(user);
  res.json({token});
});
});
