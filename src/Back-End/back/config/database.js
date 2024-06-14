const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('imobiliaria', 'postgres', 'admin', {
  host: 'localhost',
  dialect: 'postgres',
});

module.exports = sequelize;