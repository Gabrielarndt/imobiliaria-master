const express = require('express');
const router = express.Router();
const { User } = require('../models/User');
const Imovel = require('../models/Imovel'); // Importe o modelo do Imóvel

// Rota para obter as informações do usuário com base no ID
router.get('/api/usuario/:userId', async (req, res) => {
      try {
        // Recuperar o ID do usuário a partir dos parâmetros da URL
        const userId = req.params.userId;

        // Buscar as informações do usuário com base no ID
        const user = await User.findByPk(userId);
        if (!user) {
            // Se o usuário não for encontrado, retornar um erro 404
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        // Retornar as informações do usuário como JSON
        res.json({ nome: user.nome, email: user.email });
    } catch (error) {
        // Se ocorrer um erro, retornar um erro 500
        console.error('Erro ao buscar informações do usuário:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

router.get('/api/imoveis/usuario/:userId', async (req, res) => {
    try {
        const userId = req.params.userId; 
        // Faça aqui a lógica para buscar os imóveis do usuário com o ID fornecido
        // Por exemplo, você pode usar o modelo Imovel para encontrar os imóveis associados a esse usuário
        const userImoveis = await Imovel.find({ idUsuario: userId });
        res.json(userImoveis); 
    } catch (error) {
        console.error('Erro ao buscar os imóveis do usuário:', error);
        res.status(500).json({ error: 'Erro ao buscar os imóveis do usuário' }); 
    }
});


module.exports = router;
