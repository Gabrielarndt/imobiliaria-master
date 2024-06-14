// middleware/authMiddleware.js

const jwt = require('jsonwebtoken');

function verificarTokenEObterDetalhesUsuario(req, res, next) {
    const token = req.cookies.token; // Supondo que o token seja enviado como um cookie chamado 'token'

    if (!token) {
        console.log("Token de autenticação não fornecido");
        return res.redirect('/login');
    }

    try {
        const decoded = jwt.verify(token, 'seu_segredo');
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Erro ao verificar o token (Token inválido):', error);
        return res.redirect('/login');
    }
}


function authenticateJWT(req, res, next) {
    // Verifique se o token está presente no cabeçalho Authorization
    const authHeader = req.cookies.token;
    if (!authHeader) {
        return res.status(401).json({ message: 'Token de autenticação não fornecido' });
    }

    try {
        // Verifique e decodifique o token usando a chave secreta
        const decoded = jwt.verify(authHeader, 'seu_segredo');
        req.user = decoded; // Adicione o payload do token decodificado ao objeto de solicitação (req.user)

        // Verifique se o usuário é o usuário específico que você deseja autorizar
        if (req.user.id !== 13) {
            return res.status(403).json({ message: 'Você não tem permissão para acessar esta página' });
        }

        next(); // Prossiga para a próxima middleware ou rota
    } catch (error) {
        console.error('Erro ao verificar o token:', error);
        return res.status(401).json({ message: 'Token inválido' });
    }
}

function authenticateJWTImovelUser(req, res, next) {
    // Verifique se o token está presente no cabeçalho Authorization
    const authHeader = req.cookies.token;
    if (!authHeader) {
        return res.redirect('/login');
    }

    try {
        // Verifique e decodifique o token usando a chave secreta
        const decoded = jwt.verify(authHeader, 'seu_segredo');
        req.user = decoded; // Adicione o payload do token decodificado ao objeto de solicitação (req.user)

        // Verifique se o usuário é o usuário específico que você deseja autorizar
        if (!req.user.id) {
            return res.status(403).json({ message: 'Você não tem permissão para acessar esta página' });
        }

        next(); // Prossiga para a próxima middleware ou rota
    } catch (error) {
        console.error('Erro ao verificar o token:', error);
        return res.redirect('/login');
    }
}


module.exports = { authenticateJWT, verificarTokenEObterDetalhesUsuario,authenticateJWTImovelUser };