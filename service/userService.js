// src/services/userService.js
const bcrypt = require('bcrypt');
const { users } = require('../model/db');

// O "salt" (sal) é um valor aleatório usado no hashing
// O custo 10 é um bom equilíbrio entre segurança e desempenho
const saltRounds = 10;

/**
 * Registra um novo usuário com a senha criptografada.
 * Lança um erro se o e-mail já estiver em uso.
 * @param {string} email - O e-mail do usuário.
 * @param {string} password - A senha do usuário.
 * @returns {object} O novo objeto de usuário, sem a senha.
 */
async function registerUser(email, password) {
    if (users.find(u => u.email === email)) {
        // Lança um erro em vez de retornar null
        throw new Error('Email já cadastrado');
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    const user = {
        id: users.length + 1,
        email,
        password: hashedPassword // Armazena a senha criptografada
    };

    users.push(user);
    
    // Retorna o usuário sem a senha para maior segurança
    const { password: _, ...userWithoutPassword } = user; 
    return userWithoutPassword;
}

/**
 * Autentica um usuário comparando a senha fornecida com a senha criptografada.
 * @param {string} email - O e-mail do usuário.
 * @param {string} password - A senha fornecida.
 * @returns {object|null} O objeto do usuário se a autenticação for bem-sucedida, ou null.
 */
async function authenticate(email, password) {
    const user = users.find(u => u.email === email);
    
    // Se o usuário não for encontrado, retorna null imediatamente
    if (!user) {
        return null;
    }

    // Compara a senha fornecida com a senha armazenada (hashed)
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
        // Retorna o usuário sem a senha
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    return null;
}

module.exports = { registerUser, authenticate };