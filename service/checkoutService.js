// ...existing code...
const { products, orders } = require('../model/db');
function calculateFreight(items) {
  return 20 + items.length * 5;
}
function calculateTotal(items) {
  let total = 0;
  for (const item of items) {
    const product = products.find(p => p.id === item.productId);
    if (!product || product.stock < item.quantity) return null;
    total += product.price * item.quantity;
  }
  return total;
}
function checkout({ userId, items, payment }) {
  for (const item of items) {
    const product = products.find(p => p.id === item.productId);
    if (!product || product.stock < item.quantity) return { error: 'Produto indisponível' };
  }
  let total = calculateTotal(items);
  if (total === null) return { error: 'Produto indisponível' };
  const freight = calculateFreight(items);
  let discount = 0;
  if (payment.method === 'cartao') discount = total * 0.05;
  const finalValue = total + freight - discount;
  orders.push({ userId, items, payment, finalValue });
  // Atualiza estoque
  for (const item of items) {
    const product = products.find(p => p.id === item.productId);
    product.stock -= item.quantity;
  }
  return { finalValue, freight, discount };
}
module.exports = { checkout };
// ...existing code...
