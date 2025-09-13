# API Checkout - Trabalho Final

## Descrição
API REST para registro, login, listagem de produtos e checkout (boleto/cartão de crédito), com regras de negócio e autenticação JWT. Banco de dados em memória.

## Instalação
1. Clone o repositório.
2. Instale as dependências:
   ```powershell
   npm install express jsonwebtoken swagger-ui-express mocha chai supertest
   ```

## Execução
```powershell
node server.js
```

## Endpoints
- `POST /api/users/register`: Registro de usuário
- `POST /api/users/login`: Login e obtenção de token JWT
- `GET /api/products`: Lista de produtos
- `POST /api/checkout`: Realiza checkout (requer token JWT)
- `GET /api-docs`: Documentação Swagger

## Checkout
- Informe lista de produtos, quantidades, método de pagamento, dados do cartão (se necessário).
- 5% de desconto no valor total se pagar com cartão.
- Resposta contém valor final, valor do frete e desconto.

## Testes Automatizados
Execute os testes com:
```powershell
npx mocha
```

## Documentação Swagger
Acesse `/api-docs` para visualizar a documentação interativa.

## Observações
- Banco de dados em memória (dados não persistem após reiniciar).
- Estrutura separada em controller, service, model, app.js e server.js.
