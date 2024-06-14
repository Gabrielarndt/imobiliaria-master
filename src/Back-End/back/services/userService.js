//services/userService

const bcrypt = require('bcrypt');
const { User } = require('../models/User');

// Função para criar hash de senha
const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    throw new Error('Erro ao criar hash de senha');
  }
};

// Função para verificar a senha
const comparePassword = async (password, hashedPassword) => {
  try {
    const match = await bcrypt.compare(password, hashedPassword);
    return match;
  } catch (error) {
    throw new Error('Erro ao verificar a senha');
  }
};

// Função para criar um novo usuário
const createUser = async (userData) => {
  try {
    const { username, email, password } = userData;
    const hashedPassword = await hashPassword(password);
    const user = await User.create({ username, email, phone, password: hashedPassword });
    return user;
  } catch (error) {
    throw new Error('Erro ao criar usuário');
  }
};

// Função para encontrar um usuário pelo email
const findUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ where: { email } });
    return user;
  } catch (error) {
    throw new Error('Erro ao buscar usuário');
  }
};

// Função para autenticar um usuário
const authenticateUser = async (email, password) => {
  try {
    const user = await findUserByEmail(email);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      throw new Error('Senha incorreta');
    }
    return user;
  } catch (error) {
    throw new Error('Erro ao autenticar usuário');
  }
};

module.exports = {
  hashPassword,
  comparePassword,
  createUser,
  findUserByEmail,
  authenticateUser,
};
