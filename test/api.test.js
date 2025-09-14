const request = require('supertest');
const app = require('../app');
const { users, products } = require('../model/db');
const { expect } = require('chai');

// Mantenha a estrutura do banco de dados simulado limpa antes de cada teste
beforeEach(() => {
    users.length = 0;
    products.length = 0;
    products.push(
        { id: 1, name: 'Produto A', price: 100, stock: 10 },
        { id: 2, name: 'Produto B', price: 50, stock: 5 }
    );
});

describe('API Testes de Usuário e Autenticação', () => {
    let token;

    it('Deve registrar um novo usuário com sucesso', async () => {
        const res = await request(app)
            .post('/api/users/register')
            .send({ email: 'a@a.com', password: '123' });

        expect(res.statusCode).to.equal(201); // O status 201 Created é o padrão para criação de recursos.
        expect(res.body).to.have.property('user');
        expect(res.body.user).to.have.property('id').that.is.a('number');
        expect(res.body.user).to.have.property('email').that.equal('a@a.com');
    });

    it('Deve falhar ao registrar usuário com e-mail já existente', async () => {
        // Registra o usuário primeiro
        await request(app).post('/api/users/register').send({ email: 'a@a.com', password: '123' });

        // Tenta registrar novamente com o mesmo e-mail
        const res = await request(app)
            .post('/api/users/register')
            .send({ email: 'a@a.com', password: '123' });

        expect(res.statusCode).to.equal(400); // Bad Request
        expect(res.body).to.have.property('error').that.equal('Email já cadastrado');
    });

    it('Deve realizar o login e retornar um token de autenticação', async () => {
        // Garante que o usuário existe antes de tentar logar
        await request(app).post('/api/users/register').send({ email: 'b@b.com', password: '123' });

        const res = await request(app)
            .post('/api/users/login')
            .send({ email: 'b@b.com', password: '123' });

        expect(res.statusCode).to.equal(200);
        expect(res.body).to.have.property('token').that.is.a('string');
        token = res.body.token; // Armazena o token para uso posterior
    });
});


describe('API de Produtos e Checkout', () => {
    let token;

    // Hook para obter um token válido antes dos testes de checkout
    before(async () => {
        // Registra e loga um usuário para obter o token uma única vez
        await request(app).post('/api/users/register').send({ email: 'c@c.com', password: '123' });
        const res = await request(app).post('/api/users/login').send({ email: 'c@c.com', password: '123' });
        token = res.body.token;
    });

    it('Deve listar todos os produtos disponíveis', async () => {
        const res = await request(app).get('/api/products');

        expect(res.statusCode).to.equal(200);
        expect(res.body).to.be.an('array');
        expect(res.body.length).to.equal(2); // Validação do número de produtos
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
        expect(res.body).to.have.property('finalValue').that.is.a('number');
        expect(res.body).to.have.property('discount').that.is.a('number');
        expect(res.body.discount).to.be.above(0);
    });

    it('Deve realizar checkout com boleto sem aplicar desconto', async () => {
        const res = await request(app)
            .post('/api/checkout')
            .set('Authorization', `Bearer ${token}`)
            .send({
                items: [{ productId: 2, quantity: 1 }],
                payment: { method: 'boleto' }
            });

        expect(res.statusCode).to.equal(200);
        expect(res.body).to.have.property('finalValue').that.is.a('number');
        expect(res.body).to.have.property('discount').that.equal(0);
    });

    it('Deve falhar ao realizar checkout sem token de autenticação', async () => {
        const res = await request(app)
            .post('/api/checkout')
            .send({ items: [{ productId: 1, quantity: 1 }], payment: { method: 'boleto' } });

        expect(res.statusCode).to.equal(401); // Unauthorized
        expect(res.body).to.have.property('error');
    });
});
