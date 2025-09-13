// ...existing code...
const request = require('supertest');
const app = require('../app');
const { users, products } = require('../model/db');
const { expect } = require('chai');
describe('API Test', () => {
  let token;
  before(() => { users.length = 0; });
  it('Deve registrar usuário', async () => {
    const res = await request(app).post('/api/users/register').send({ email: 'a@a.com', password: '123' });
    expect(res.statusCode).to.equal(200);
    expect(res.body).to.have.property('id');
  });
  it('Deve logar e retornar token', async () => {
    const res = await request(app).post('/api/users/login').send({ email: 'a@a.com', password: '123' });
    expect(res.statusCode).to.equal(200);
    expect(res.body).to.have.property('token');
    token = res.body.token;
  });
  it('Deve listar produtos', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).to.equal(200);
    expect(res.body).to.be.an('array');
  });
  it('Deve realizar checkout com cartão e aplicar desconto', async () => {
    const res = await request(app)
      .post('/api/checkout')
      .set('Authorization', `Bearer ${token}`)
      .send({
        items: [{ productId: 1, quantity: 1 }],
        payment: { method: 'cartao', card: { number: '1234', name: 'A', expiry: '12/25', cvv: '123' } }
      });
    expect(res.statusCode).to.equal(200);
    expect(res.body).to.have.property('finalValue');
    expect(res.body).to.have.property('discount');
    expect(res.body.discount).to.be.above(0);
  });
  it('Deve realizar checkout com boleto sem desconto', async () => {
    const res = await request(app)
      .post('/api/checkout')
      .set('Authorization', `Bearer ${token}`)
      .send({
        items: [{ productId: 2, quantity: 1 }],
        payment: { method: 'boleto' }
      });
    expect(res.statusCode).to.equal(200);
    expect(res.body).to.have.property('finalValue');
    expect(res.body.discount).to.equal(0);
  });
  it('Deve falhar checkout sem token', async () => {
    const res = await request(app)
      .post('/api/checkout')
      .send({ items: [{ productId: 1, quantity: 1 }], payment: { method: 'boleto' } });
    expect(res.statusCode).to.equal(401);
  });
});
// ...existing code...
