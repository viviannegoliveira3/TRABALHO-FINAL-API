// ...existing code...
const express = require('express');
const router = express.Router();
const { listProducts } = require('../service/productService');
router.get('/', (req, res) => {
  res.json(listProducts());
});
module.exports = router;
// ...existing code...
