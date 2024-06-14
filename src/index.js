//index.js
import 'path-browserify';
const express = require('express');
const path = require('path');
const cors = require('cors');
const bcrypt = require('bcrypt');
// const multer = require('multer');
const authRouter = require('./Back-End/back/routes/authRoutes'); // Importe as suas rotas de autenticação
const imoveisRouter = require('./Back-End/back/routes/imoveis');
const bodyParser = require('body-parser');
const authController = require('./Back-End/back/controllers/authController'); // Importe o controlador de autenticação
const User = require('./Back-End/back/models/User');
const passport = require('./Back-End/back/passport');
const { verificarTokenEObterDetalhesUsuario } = require('./Back-End/back/middleware/authMiddleware')
const usuarioRouter = require('./Back-End/back/routes/userRoutes')
const { authenticateJWT } = require('./Back-End/back/middleware/authMiddleware');
const { authenticateJWTImovelUser } = require('./Back-End/back/middleware/authMiddleware');
const imoveisImagemRouter = require('./Back-End/back/routes/imoveis'); // Importe o arquivo de rota de imagens de imóveis
const Imovel = require("./Back-End/back/models/Imovel");
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 3000; // Define a porta do servidor

app.use(passport.initialize());
app.use(cookieParser());

app.use(cors());
app.use(express.static(path.join(__dirname, 'src')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'pages'));

// Rotas de autenticação
app.use('/api/imoveis/imagens', imoveisImagemRouter);
app.use('/api', usuarioRouter);
app.use('/api/imoveis', imoveisRouter);
app.use('/api/auth', authRouter); // Use o authRouter para lidar com rotas de autenticação
app.post('/api/auth/login', authController.loginUser); // Rota para login de usuários
app.post('/api/auth/register', authController.registerUser); // Rota para registro de usuários
app.post('/api/auth/logout', authController.logoutUser); // Rota para logout de usuários


// Rotas para servir páginas HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'pages', 'index.html'));
});

app.get('/cadastroImovel',authenticateJWT, (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'pages', 'cadastro.html'));
});

app.get('/cadastroImovelUser',authenticateJWTImovelUser, (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'pages', 'cadastroImovelUser.html'));
});

app.get('/cadastro', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'pages', 'cadastroCliente.html'));
});


app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'pages', 'login.html'));
});

app.get('/logout', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'pages', 'logout.html'));
});

app.get('/resultado', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'pages', 'results.html'));
});

app.get('/detalhes', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'pages', 'detalhes.html'));
});

app.get('/analise',authenticateJWT, (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'pages', 'analise.html'));
});

app.get('/seusImoveis', authenticateJWTImovelUser, (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'pages', 'imoveisUser.html'));
});

app.get('/api/imoveis/usuario/:userId', async (req, res) => {
  try {
    const userId = req.params.userId; 
    const userImoveis = await Imovel.find({ idUsuario: userId });
    res.json(userImoveis); 
  } catch (error) {
    console.error('Erro ao buscar os imóveis do usuário:', error);
    res.status(500).json({ error: 'Erro ao buscar os imóveis do usuário' }); 
  }
});

app.get('/api/user/id', authenticateJWT, (req, res) => {
  const userId = req.user.id;
  res.json({ userId });
});

// Rota protegida que requer autenticação
app.get('/usuario', verificarTokenEObterDetalhesUsuario, (req, res) => {
  res.render('usuario');
});

app.get('/api/usuario/:userId', async (req, res) => {
  try {
    // Recuperar o ID do usuário a partir dos parâmetros da URL
    const userId = req.params.userId;

    // Buscar as informações do usuário com base no ID
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Retornar as informações do usuário como JSON
    res.json(user);
  } catch (error) {
    console.error('Erro ao buscar informações do usuário:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

app.get('/editarImovel',authenticateJWT, (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'pages', 'editaImovel.html'));
});

// Rota para obter os dados de um imóvel pelo ID
app.get('/api/imoveis/:id', async (req, res) => {
  try {
      const imovelId = req.params.id;
      const imovel = await Imovel.findByPk(imovelId);

      if (!imovel) {
          return res.status(404).json({ error: 'Imóvel não encontrado' });
      }

      // Converte as fotos para o formato esperado se necessário
      if (imovel.fotos && !Array.isArray(imovel.fotos)) {
          imovel.fotos = [imovel.fotos];
      }

      res.status(200).json(imovel);
  } catch (error) {
      console.error('Erro ao obter detalhes do imóvel:', error);
      res.status(500).json({ error: 'Erro interno do servidor ao buscar detalhes do imóvel' });
  }
});





// Rota para editar os dados de um imóvel
app.put('/api/imoveis/:id', async (req, res) => {
  const { id } = req.params;
  const { titulo, descricao, tipo, tipoImovel, quartos, garagens, suites, preco, cidade, bairro, rua, status } = req.body;
  try {
      const imovel = await Imovel.findByPk(id); // Supondo que você tenha um modelo Imovel
      if (!imovel) {
          return res.status(404).json({ message: 'Imóvel não encontrado' });
      }

      imovel.titulo = titulo;
      imovel.descricao = descricao;
      imovel.tipo = tipo;
      imovel.tipoImovel = tipoImovel;
      imovel.quartos = quartos;
      imovel.garagens = garagens;
      imovel.suites = suites;
      imovel.preco = preco;
      imovel.cidade = cidade;
      imovel.bairro = bairro;
      imovel.rua = rua;
      imovel.status = status;

      await imovel.save();

      res.status(200).json({ message: 'Imóvel atualizado com sucesso!', imovel });
  } catch (error) {
      console.error('Erro ao atualizar imóvel:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

app.get('/editaUser', (req, res) => {
  res.render('editaUser'); // Renderiza a página de edição de informações
});

// Rota para editar informações do usuário
app.post('/api/editarUsuario', async (req, res) => {
  try {
    const userId = req.cookies.userId // Obtém o ID do usuário autenticado
    const { username, phone, password } = req.body; // Obtém os novos dados do usuário a serem atualizados

    // Verifica se o usuário existe no banco de dados
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Verifica se a senha fornecida pelo usuário está correta
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Senha incorreta. Não é possível atualizar as informações do usuário.' });
    }

    // Verifica se o novo nome de usuário já está em uso por outro usuário
    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername && existingUsername.id !== req.cookies.userId) {
      return res.status(400).json({ message: 'Nome de usuário já em uso. Escolha outro.' });
    }

    // Verifica se o novo número de telefone já está em uso por outro usuário
    const existingPhone = await User.findOne({ where: { phone } });
    if (existingPhone && existingPhone.id !== req.cookies.userId) {
      return res.status(400).json({ message: 'Número de telefone já em uso. Escolha outro.' });
    }

    // Atualiza as informações do usuário no banco de dados
    user.username = username;
    user.phone = phone;
    await user.save();

    // Retorna uma resposta de sucesso
    return res.status(200).json({ message: 'Informações do usuário atualizadas com sucesso!', user });
  } catch (error) {
    console.error('Erro ao atualizar informações do usuário:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

app.get('/editaSenha', (req, res) => {
  res.render('editaSenha'); // Renderiza a página de edição de senha
});

// Rota para atualizar a senha do usuário
app.post('/api/editarSenha', async (req, res) => {
  try {
    const userId = req.cookies.userId; // Obtém o ID do usuário autenticado
    const { oldPassword, newPassword, confirmPassword } = req.body; // Obtém as senhas fornecidas

    // Verifica se a nova senha e a confirmação são iguais
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'A nova senha e a confirmação de senha não coincidem.' });
    }

    // Verifica se o usuário existe no banco de dados
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Verifica se a senha antiga fornecida pelo usuário está correta
    const passwordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Senha antiga incorreta. Não é possível atualizar a senha.' });
    }

    // Criptografa a nova senha
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Atualiza a senha do usuário no banco de dados
    user.password = hashedPassword;
    await user.save();

    // Retorna uma resposta de sucesso
    return res.status(200).json({ message: 'Senha atualizada com sucesso!' });
  } catch (error) {
    console.error('Erro ao atualizar a senha:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

const server = app.listen(PORT, () => {
  console.log(`Servidor iniciado na porta ${PORT}`);
});

module.exports = { app, server };