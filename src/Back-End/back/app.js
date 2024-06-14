// app.js 

const express = require('express');
const app = express();
const authRoutes = require('./routes/authRoutes');
const protectedRoutes = require('./routes/protectedRoutes');
const helmet = require('helmet');

app.use(express.json());

app.use('/auth', authRoutes);

app.use('/protected', protectedRoutes);

// Usar Helmet.js com configurações personalizadas
app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", 'trusted-scripts.com'],
          objectSrc: ['none'],
        },
      },
    })
  );

  const jwt = require('jsonwebtoken');

// Chave secreta para assinar o token JWT (geralmente deve ser mantida em um ambiente seguro)
const JWT_SECRET = 'seu_segredo';

// Função para gerar um token JWT
const generateToken = (user) => {
  const payload = {
    userId: user.id,
    email: user.email,
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }); // Token expira em 1 hora
};

// Função para verificar um token JWT
const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    return null; // Token inválido
  }
};


module.exports = {app, generateToken, verifyToken};
