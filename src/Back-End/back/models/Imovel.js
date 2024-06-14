const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const fs = require('fs');
const path = require('path');

const Imoveis = sequelize.define('Imoveis', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  tipo: {
    type: DataTypes.ENUM('aluguel', 'venda'),
    allowNull: true,
  },
  quartos: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  garagens: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  suites: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  preco: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  cidade: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  bairro: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  rua: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  tipoImovel: {
    type: DataTypes.ENUM('apartamento', 'casa', 'terreno','sala-escritorio', 'loja', 'galpao', 'imovel-rural'),
    allowNull: true,
  },
  areaUtil:{
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  areaTotal:{
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  idUsuario:{
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  fotos: {
    type: DataTypes.JSON, // Alterado para armazenar os nomes dos arquivos das imagens
    allowNull: true,
  },
  ordemFotos: {
    type: DataTypes.JSON, // Mantido como está
    allowNull: true,
  }
});

Imoveis.salvarImagens = async function(imovelId, fotos) {
  const diretorioImoveis = path.join(__dirname, '../uploads'); // Substitua pelo caminho real onde deseja armazenar as imagens
  const diretorioImovel = path.join(diretorioImoveis, imovelId.toString());

  // Crie o diretório do imóvel se não existir
  if (!fs.existsSync(diretorioImovel)) {
    fs.mkdirSync(diretorioImovel);
  }

  // Salve cada imagem no diretório do imóvel
  for (let foto of fotos) {
    const nomeArquivo = foto.name;
    const caminhoArquivo = path.join(diretorioImovel, nomeArquivo);
    await fs.promises.writeFile(caminhoArquivo, foto.file); // Salva o arquivo no sistema de arquivos
  }

  // Atualize o modelo do imóvel no banco de dados para incluir os nomes dos arquivos das imagens
  await Imoveis.update({ fotos: fotos.map(foto => foto.name) }, { where: { id: imovelId } });
};

module.exports = Imoveis;
