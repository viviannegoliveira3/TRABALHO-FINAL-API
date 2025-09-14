const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes');

// ...código existente...

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;