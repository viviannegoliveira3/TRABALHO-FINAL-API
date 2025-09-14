const { products, orders } = require('../model/db');

/**
 * Calcula o valor do frete com base na quantidade de itens.
 * @param {Array<Object>} items - Array de itens no carrinho.
 * @returns {number} O valor do frete.
 */
function calculateFreight(items) {
    return 20 + items.length * 5;
}

/**
 * Calcula o valor total dos produtos no carrinho.
 * @param {Array<Object>} items - Array de itens no carrinho.
 * @returns {number} O valor total dos produtos.
 */
function calculateTotal(items) {
    let total = 0;
    for (const item of items) {
        const product = products.find(p => p.id === item.productId);
        // Assumimos que a validação de estoque já foi feita
        total += product.price * item.quantity;
    }
    return total;
}

/**
 * Processa a finalização da compra.
 * @param {object} params - Parâmetros da compra.
 * @param {string} params.userId - O ID do usuário.
 * @param {Array<Object>} params.items - Array de itens.
 * @param {object} params.payment - Informações de pagamento.
 * @returns {object} Um objeto com os valores finais ou um erro.
 */
function checkout({ userId, items, payment }) {
    // 1. Validação de Produtos e Estoque
    for (const item of items) {
        const product = products.find(p => p.id === item.productId);
        if (!product || product.stock < item.quantity) {
            return { error: 'Produto indisponível ou fora de estoque' };
        }
    }

    // 2. Cálculo dos valores
    const total = calculateTotal(items);
    const freight = calculateFreight(items);
    let discount = 0;

    // 3. Aplicação do desconto se o método de pagamento for cartão
    if (payment.method === 'cartao') {
        discount = total * 0.05;
    }

    const finalValue = total + freight - discount;

    // 4. Criação e persistência do pedido
    const newOrder = { userId, items, payment, finalValue, total, freight, discount };
    orders.push(newOrder);

    // 5. Atualização do estoque
    for (const item of items) {
        const product = products.find(p => p.id === item.productId);
        product.stock -= item.quantity;
    }

    // 6. Retorno dos valores calculados
    return { finalValue, total, freight, discount };
}

module.exports = { checkout };