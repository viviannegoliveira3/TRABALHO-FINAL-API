// ...existing code...
const { products } = require('../model/db');
function listProducts() {
  return products;
}
module.exports = { listProducts };
// ...existing code...
