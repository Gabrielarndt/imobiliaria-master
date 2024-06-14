//models/Favorito

const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');
const User = require('./User'); // Importe o modelo User
const Imovel = require('./Imovel'); // Importe o modelo Imovel

const Favorito = sequelize.define('Favorito', {
  // Defina as colunas da tabela de favoritos
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User, // Referência ao model do usuário
      key: 'id'
    }
  },
  imovelId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Imovel, // Referência ao model do imóvel
      key: 'id'
    }
  }
});

module.exports = Favorito;
