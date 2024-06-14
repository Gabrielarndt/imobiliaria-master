//authController.js

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function registerUser(req, res) {
    try {
        const { email, password, username, phone } = req.body;

        const existingUsername = await User.findOne({ where: { username } });
        if (existingUsername) {
            return res.status(400).json({ message: 'Nome já em uso' });
        }

        // Verifique se o email já está em uso
        const existingUserEmail = await User.findOne({ where: { email } });
        if (existingUserEmail) {
            return res.status(400).json({ message: 'Email já em uso' });
        }

        // Verifique se o telefone já está em uso
        const existingUserPhone = await User.findOne({ where: { phone } });
        if (existingUserPhone) {
            return res.status(400).json({ message: 'Número de telefone já em uso' });
        }

        // Aqui você pode adicionar a validação para o formato de email, se necessário

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ email, username, phone, password: hashedPassword });

        return res.status(200).json({ message: 'Usuário cadastrado com sucesso' }); // Resposta JSON
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ message: 'Cadastro inválido, verifique as informações' });
    }
}




async function loginUser(req, res) {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Email ou senha incorreto' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Email ou senha incorreto' });
        }

        const token = jwt.sign({ id: user.id, email: user.email, name: user.username }, 'seu_segredo', { expiresIn: '1h' });
        console.log('ID do usuário recuperado:', user.id);

        res.cookie('token', token, { httpOnly: true });

        res.cookie('userId', user.id);
        
        res.status(200).json({ token, user });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

async function logoutUser(req, res) {
    try {
        res.clearCookie('token');
        return res.redirect('/');
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
}

async function updateUser(req, res) {
    try {
        const userId = req.user.id; // Obtém o ID do usuário autenticado
        const { username, phone, password } = req.body; // Obtém os novos dados do usuário a serem atualizados

        // Verifica a senha fornecida pelo usuário
        const user = await User.findByPk(userId);
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Senha incorreta. As informações do usuário não foram atualizadas.' });
        }

        // Verifica se o novo username já está em uso por outro usuário
        const existingUsername = await User.findOne({ where: { username } });
        if (existingUsername && existingUsername.id !== req.user.id) {
            return res.status(400).json({ message: 'Nome de usuário já em uso. Escolha outro.' });
        }

        // Verifica se o novo número de telefone já está em uso por outro usuário
        const existingPhone = await User.findOne({ where: { phone } });
        if (existingPhone && existingPhone.id !== req.user.id) {
            return res.status(400).json({ message: 'Número de telefone já em uso. Escolha outro.' });
        }
        
        // Atualiza as informações do usuário no banco de dados
        user.username = username;
        user.phone = phone;
        await user.save();
        
        return res.status(200).json({ message: 'Informações do usuário atualizadas com sucesso!', user });
    } catch (error) {
        console.error('Erro ao atualizar informações do usuário:', error);
        return res.status(500).json({ message: 'Erro interno do servidor' });
    }
}

module.exports = { registerUser, loginUser, logoutUser, updateUser };

