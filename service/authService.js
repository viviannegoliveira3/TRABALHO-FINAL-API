// src/services/authService.js

const jwt = require('jsonwebtoken');

// A chave secreta deve ser armazenada em uma variável de ambiente
const SECRET = process.env.JWT_SECRET || 'supersecretdefault';

/**
 * Gera um token JWT para um usuário.
 * @param {object} user - O objeto do usuário contendo o ID e e-mail.
 * @returns {string} O token JWT assinado.
 */
function generateToken(user) {
    const payload = {
        id: user.id,
        email: user.email
    };
    // O token expira em 1 hora
    return jwt.sign(payload, SECRET, { expiresIn: '1h' });
}

/**
 * Verifica e decodifica um token JWT.
 * @param {string} token - O token JWT a ser verificado.
 * @returns {object|null} O payload do token se for válido, ou null se for inválido.
 */
function verifyToken(token) {
    try {
        return jwt.verify(token, SECRET);
    } catch (err) {
        // Retorna null para qualquer erro de verificação (token expirado, inválido, etc.)
        return null;
    }
}

module.exports = { generateToken, verifyToken };
