// controllers/favoritesController.js

const  Favorite  = require('../models/Favorito');
const Imovel = require('../models/Imovel');

async function addFavorite(req, res) {
  try {
    const { userId, imovelId } = req.body;
    await Favorite.create({ userId, imovelId });
    res.status(201).json({ message: 'Imóvel adicionado aos favoritos com sucesso!' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Erro ao adicionar imóvel aos favoritos.' });
  }
}

async function removeFavorite(req, res) {
  try {
    const { userId, imovelId } = req.body;
    await Favorite.destroy({ where: { userId, imovelId } });
    res.status(200).json({ message: 'Imóvel removido dos favoritos com sucesso!' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Erro ao remover imóvel dos favoritos.' });
  }
}

async function listFavorites(req, res) {
  try {
    const userId = req.user.id; // Assume-se que o ID do usuário está presente no objeto de solicitação após a autenticação

    // Busca os IDs dos imóveis favoritos do usuário
    const favoritos = await Favorito.findAll({ where: { userId } });
    const imovelIds = favoritos.map(favorito => favorito.imovelId);

    // Busca os imóveis favoritos com base nos IDs
    const imoveis = await Imovel.findAll({ where: { id: imovelIds } });

    res.status(200).json(imoveis);
  } catch (error) {
    console.error('Erro ao listar imóveis favoritos:', error);
    res.status(500).json({ message: 'Erro ao listar imóveis favoritos.' });
  }
}

module.exports = { addFavorite, removeFavorite, listFavorites };
