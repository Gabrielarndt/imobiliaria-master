//ImovelController.js

const Imovel = require('../models/Imovel');

// Create (Criar um novo imóvel)
exports.create = async (req, res) => {
  try {
    console.log('Dados recebidos do formulário:', req.body);

    const imovel = await Imovel.create(req.body);
    res.status(201).json(imovel);
  } catch (error) {
    console.error('Erro ao cadastrar imóvel:', error);
    res.status(500).json({ message: 'Erro ao criar o imóvel' });
  }
};

// Read (Listar todos os imóveis)
exports.list = async (req, res) => {
  try {
    const imoveis = await Imovel.findAll();
    res.status(200).json(imoveis);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao listar os imóveis' });
  }
};

// Read (Obter detalhes de um imóvel específico)
exports.getById = async (req, res) => {
  const { id } = req.params;
  try {
    const imovel = await Imovel.findByPk(id);
    if (!imovel) {
      return res.status(404).json({ message: 'Imóvel não encontrado' });
    }
    res.status(200).json(imovel);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao obter detalhes do imóvel' });
  }
};

// Update (Atualizar um imóvel existente)
exports.update = async (req, res) => {
  const { id } = req.params;
  try {
    const [updated] = await Imovel.update(req.body, {
      where: { id }
    });
    if (!updated) {
      return res.status(404).json({ message: 'Imóvel não encontrado' });
    }
    const imovel = await Imovel.findByPk(id);
    res.status(200).json(imovel);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao atualizar o imóvel' });
  }
};

// Delete (Excluir um imóvel existente)
exports.delete = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Imovel.destroy({
      where: { id }
    });
    if (!deleted) {
      return res.status(404).json({ message: 'Imóvel não encontrado' });
    }
    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao excluir o imóvel' });
  }
};
