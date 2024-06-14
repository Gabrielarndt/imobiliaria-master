// routes/imoveis.js

const express = require('express');
const router = express.Router();
const ImovelController = require('../controllers/ImovelController');
const Imoveis = require('../models/Imovel');
const path = require('path');
const db = require('../config/database');
const sequelize = db.sequelize; // Acessando o objeto sequelize

// Rota para lidar com o envio de dados do formulário e criar um novo imóvel
router.post('/', async (req, res) => {
    try {
        const imovelData = req.body;
        const novoImovel = await Imoveis.create(imovelData);
        res.status(201).json(novoImovel);
    } catch (error) {
        console.error('Erro ao cadastrar imóvel:', error);
        res.status(500).json({ error: 'Erro ao cadastrar imóvel' });
    }
});

router.get('/buscar', async (req, res) => {
    try {
        // Extrair os parâmetros de busca da query da requisição
        const { tipo, cidade, precoMinimo, precoMaximo, quartos, suites, garagens, tipoImovel } = req.query;

        let whereClause = {};
        if (tipo) whereClause.tipo = tipo;
        if (cidade) whereClause.cidade = cidade;

        const precoMinimoInt = parseInt(precoMinimo);
        const precoMaximoInt = parseInt(precoMaximo);

        if (!isNaN(precoMinimoInt) && !isNaN(precoMaximoInt)) {
            // Construir a cláusula WHERE do filtro de preço
            whereClause.preco = { [db.Sequelize.Op.between]: [precoMinimoInt, precoMaximoInt] };
        } else if (!isNaN(precoMinimoInt)) {
            whereClause.preco = { [db.Sequelize.Op.gte]: precoMinimoInt };
        } else if (!isNaN(precoMaximoInt)) {
            whereClause.preco = { [db.Sequelize.Op.lte]: precoMaximoInt };
        }

        const quartosInt = parseInt(quartos)
        const suitesInt = parseInt(suites)
        const garagensInt = parseInt(garagens)

        if (quartosInt == 5) {
            whereClause.quartos =  { [db.Sequelize.Op.gte]: quartosInt }
        } else if(quartos) {whereClause.quartos = parseInt(quartos)}
        if (suitesInt == 5) {
            whereClause.quartos =  { [db.Sequelize.Op.gte]: suitesInt }
        } else if(suites) {whereClause.suites = parseInt(suites)}
        if (garagensInt == 5) {
            whereClause.quartos =  { [db.Sequelize.Op.gte]: garagensInt }
        } else if(garagens) {whereClause.suites = parseInt(garagens)}


        if (tipoImovel) whereClause.tipoImovel = tipoImovel;

        const imoveisFiltrados = await Imoveis.findAll({ where: whereClause });


        console.log(typeof imoveisFiltrados); // Verifica o tipo de dados retornado

        // Retornar os imóveis filtrados como resposta
        res.status(200).json(imoveisFiltrados);
    } catch (error) {
        console.error('Erro ao buscar imóveis:', error);
        res.status(500).json({ error: 'Erro ao buscar imóveis' });
    }
});




// Rota para obter detalhes de um imóvel específico
router.get('/:id', async (req, res) => {
    try {
        const imovel = await Imoveis.findByPk(req.params.id);
        if (!imovel) {
            return res.status(404).json({ message: 'Imóvel não encontrado' });
        }

        // Adiciona um log para verificar a estrutura de imovel.fotos
        console.log('Estrutura de imovel.fotos:', imovel.fotos);

        // Certifique-se de que imovel.fotos é um array
        let imagensUrls = [];
        if (Array.isArray(imovel.fotos)) {
            imagensUrls = imovel.fotos.map(imagem => imagem.url);
        } else {
            console.warn('imovel.fotos não é um array:', imovel.fotos);
        }

        // Criar um objeto de resposta com os detalhes do imóvel e as URLs das imagens
        const resposta = {
            id: imovel.id,
            titulo: imovel.titulo,
            descricao: imovel.descricao,
            tipo: imovel.tipo,
            quartos: imovel.quartos,
            suites: imovel.suites,
            garagens: imovel.garagens,
            preco: imovel.preco,
            cidade: imovel.cidade,
            bairro: imovel.bairro,
            rua: imovel.rua,
            tipoImovel: imovel.tipoImovel,
            status: imovel.status,
            fotos: imagensUrls
        };

        res.status(200).json(resposta);
    } catch (error) {
        console.error('Erro ao obter detalhes do imóvel:', error);
        res.status(500).json({ error: 'Erro ao obter detalhes do imóvel' });
    }
});


router.put('/:id', async (req, res) => {
    try {
        const imovel = await Imoveis.findByPk(req.params.id);
        if (imovel) {
            await imovel.update(req.body);
            res.status(200).json(imovel);
        } else {
            res.status(404).json({ error: 'Imóvel não encontrado' });
        }
    } catch (error) {
        console.error('Erro ao editar imóvel:', error);
        res.status(500).json({ error: 'Erro ao editar imóvel' });
    }
});


// Rotas adicionais para operações CRUD de imóveis utilizando ImovelController
router.get('/', ImovelController.list); // Listar todos os imóveis
router.put('/:id', ImovelController.update); // Atualizar um imóvel existente
router.delete('/:id', ImovelController.delete); // Excluir um imóvel existente

module.exports = router;
