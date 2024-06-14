const express = require('express');

function createServer() {
  const app = express();
  
  // Middleware para parsear o body da requisição como JSON
  app.use(express.json());
  
  // Rotas
  const imoveisRouter = require('../routes/imoveis');
  app.use('/api/imoveis', imoveisRouter);

  // Middleware para tratar erros
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Erro interno do servidor' });
  });
  
  return app;
}

module.exports = createServer;
