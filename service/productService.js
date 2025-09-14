// src/services/productService.js
const { products } = require('../model/db');

/**
 * Retorna uma lista de todos os produtos disponíveis.
 * Retorna uma cópia do array para evitar modificações indesejadas nos dados originais.
 *
 * @returns {Array<Object>} Um array de objetos de produtos.
 */
function getAllProducts() {
  if (!products) {
    // Retorna um array vazio ou lança um erro se o banco de dados não estiver disponível
    console.error('Erro: A lista de produtos não foi carregada.');
    return [];
  }
  return [...products];
}

module.exports = { getAllProducts };