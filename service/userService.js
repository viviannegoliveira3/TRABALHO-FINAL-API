// ...existing code...
const { users } = require('../model/db');
function register(email, password) {
  if (users.find(u => u.email === email)) return null;
  const user = { id: users.length + 1, email, password };
  users.push(user);
  return user;
}
function login(email, password) {
  return users.find(u => u.email === email && u.password === password) || null;
}
module.exports = { register, login };
// ...existing code...
