(self["webpackChunkimobiliaria"] = self["webpackChunkimobiliaria"] || []).push([["main"],{

/***/ "./src/Back-End/back/config/database.js":
/*!**********************************************!*\
  !*** ./src/Back-End/back/config/database.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const {
  Sequelize
} = __webpack_require__(/*! sequelize */ "sequelize");
const sequelize = new Sequelize('imobiliaria', 'postgres', 'admin', {
  host: 'localhost',
  dialect: 'postgres'
});
module.exports = sequelize;

/***/ }),

/***/ "./src/Back-End/back/controllers/ImovelController.js":
/*!***********************************************************!*\
  !*** ./src/Back-End/back/controllers/ImovelController.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

//ImovelController.js

const Imovel = __webpack_require__(/*! ../models/Imovel */ "./src/Back-End/back/models/Imovel.js");

// Create (Criar um novo imóvel)
exports.create = async (req, res) => {
  try {
    console.log('Dados recebidos do formulário:', req.body);
    const imovel = await Imovel.create(req.body);
    res.status(201).json(imovel);
  } catch (error) {
    console.error('Erro ao cadastrar imóvel:', error);
    res.status(500).json({
      message: 'Erro ao criar o imóvel'
    });
  }
};

// Read (Listar todos os imóveis)
exports.list = async (req, res) => {
  try {
    const imoveis = await Imovel.findAll();
    res.status(200).json(imoveis);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Erro ao listar os imóveis'
    });
  }
};

// Read (Obter detalhes de um imóvel específico)
exports.getById = async (req, res) => {
  const {
    id
  } = req.params;
  try {
    const imovel = await Imovel.findByPk(id);
    if (!imovel) {
      return res.status(404).json({
        message: 'Imóvel não encontrado'
      });
    }
    res.status(200).json(imovel);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Erro ao obter detalhes do imóvel'
    });
  }
};

// Update (Atualizar um imóvel existente)
exports.update = async (req, res) => {
  const {
    id
  } = req.params;
  try {
    const [updated] = await Imovel.update(req.body, {
      where: {
        id
      }
    });
    if (!updated) {
      return res.status(404).json({
        message: 'Imóvel não encontrado'
      });
    }
    const imovel = await Imovel.findByPk(id);
    res.status(200).json(imovel);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Erro ao atualizar o imóvel'
    });
  }
};

// Delete (Excluir um imóvel existente)
exports["delete"] = async (req, res) => {
  const {
    id
  } = req.params;
  try {
    const deleted = await Imovel.destroy({
      where: {
        id
      }
    });
    if (!deleted) {
      return res.status(404).json({
        message: 'Imóvel não encontrado'
      });
    }
    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Erro ao excluir o imóvel'
    });
  }
};

/***/ }),

/***/ "./src/Back-End/back/controllers/authController.js":
/*!*********************************************************!*\
  !*** ./src/Back-End/back/controllers/authController.js ***!
  \*********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

//authController.js

const bcrypt = __webpack_require__(/*! bcrypt */ "bcrypt");
const jwt = __webpack_require__(/*! jsonwebtoken */ "jsonwebtoken");
const User = __webpack_require__(/*! ../models/User */ "./src/Back-End/back/models/User.js");
async function registerUser(req, res) {
  try {
    const {
      email,
      password,
      username,
      phone
    } = req.body;
    const existingUsername = await User.findOne({
      where: {
        username
      }
    });
    if (existingUsername) {
      return res.status(400).json({
        message: 'Nome já em uso'
      });
    }

    // Verifique se o email já está em uso
    const existingUserEmail = await User.findOne({
      where: {
        email
      }
    });
    if (existingUserEmail) {
      return res.status(400).json({
        message: 'Email já em uso'
      });
    }

    // Verifique se o telefone já está em uso
    const existingUserPhone = await User.findOne({
      where: {
        phone
      }
    });
    if (existingUserPhone) {
      return res.status(400).json({
        message: 'Número de telefone já em uso'
      });
    }

    // Aqui você pode adicionar a validação para o formato de email, se necessário

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      email,
      username,
      phone,
      password: hashedPassword
    });
    return res.status(200).json({
      message: 'Usuário cadastrado com sucesso'
    }); // Resposta JSON
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      message: 'Cadastro inválido, verifique as informações'
    });
  }
}
async function loginUser(req, res) {
  try {
    const {
      email,
      password
    } = req.body;
    const user = await User.findOne({
      where: {
        email
      }
    });
    if (!user) {
      return res.status(401).json({
        message: 'Email ou senha incorreto'
      });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({
        message: 'Email ou senha incorreto'
      });
    }
    const token = jwt.sign({
      id: user.id,
      email: user.email,
      name: user.username
    }, 'seu_segredo', {
      expiresIn: '1h'
    });
    console.log('ID do usuário recuperado:', user.id);
    res.cookie('token', token, {
      httpOnly: true
    });
    res.cookie('userId', user.id);
    res.status(200).json({
      token,
      user
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
}
async function logoutUser(req, res) {
  try {
    res.clearCookie('token');
    return res.redirect('/');
  } catch (error) {
    console.error('Erro:', error);
    res.status(500).json({
      message: 'Erro interno do servidor'
    });
  }
}
async function updateUser(req, res) {
  try {
    const userId = req.user.id; // Obtém o ID do usuário autenticado
    const {
      username,
      phone,
      password
    } = req.body; // Obtém os novos dados do usuário a serem atualizados

    // Verifica a senha fornecida pelo usuário
    const user = await User.findByPk(userId);
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({
        message: 'Senha incorreta. As informações do usuário não foram atualizadas.'
      });
    }

    // Verifica se o novo username já está em uso por outro usuário
    const existingUsername = await User.findOne({
      where: {
        username
      }
    });
    if (existingUsername && existingUsername.id !== req.user.id) {
      return res.status(400).json({
        message: 'Nome de usuário já em uso. Escolha outro.'
      });
    }

    // Verifica se o novo número de telefone já está em uso por outro usuário
    const existingPhone = await User.findOne({
      where: {
        phone
      }
    });
    if (existingPhone && existingPhone.id !== req.user.id) {
      return res.status(400).json({
        message: 'Número de telefone já em uso. Escolha outro.'
      });
    }

    // Atualiza as informações do usuário no banco de dados
    user.username = username;
    user.phone = phone;
    await user.save();
    return res.status(200).json({
      message: 'Informações do usuário atualizadas com sucesso!',
      user
    });
  } catch (error) {
    console.error('Erro ao atualizar informações do usuário:', error);
    return res.status(500).json({
      message: 'Erro interno do servidor'
    });
  }
}
module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  updateUser
};

/***/ }),

/***/ "./src/Back-End/back/middleware/authMiddleware.js":
/*!********************************************************!*\
  !*** ./src/Back-End/back/middleware/authMiddleware.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// middleware/authMiddleware.js

const jwt = __webpack_require__(/*! jsonwebtoken */ "jsonwebtoken");
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
    return res.status(401).json({
      message: 'Token de autenticação não fornecido'
    });
  }
  try {
    // Verifique e decodifique o token usando a chave secreta
    const decoded = jwt.verify(authHeader, 'seu_segredo');
    req.user = decoded; // Adicione o payload do token decodificado ao objeto de solicitação (req.user)

    // Verifique se o usuário é o usuário específico que você deseja autorizar
    if (req.user.id !== 13) {
      return res.status(403).json({
        message: 'Você não tem permissão para acessar esta página'
      });
    }
    next(); // Prossiga para a próxima middleware ou rota
  } catch (error) {
    console.error('Erro ao verificar o token:', error);
    return res.status(401).json({
      message: 'Token inválido'
    });
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
      return res.status(403).json({
        message: 'Você não tem permissão para acessar esta página'
      });
    }
    next(); // Prossiga para a próxima middleware ou rota
  } catch (error) {
    console.error('Erro ao verificar o token:', error);
    return res.redirect('/login');
  }
}
module.exports = {
  authenticateJWT,
  verificarTokenEObterDetalhesUsuario,
  authenticateJWTImovelUser
};

/***/ }),

/***/ "./src/Back-End/back/models/Imovel.js":
/*!********************************************!*\
  !*** ./src/Back-End/back/models/Imovel.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var __dirname = "/";
const {
  DataTypes
} = __webpack_require__(/*! sequelize */ "sequelize");
const sequelize = __webpack_require__(/*! ../config/database */ "./src/Back-End/back/config/database.js");
const fs = __webpack_require__(/*! fs */ "fs");
const path = __webpack_require__(/*! path */ "./node_modules/path-browserify/index.js");
const Imoveis = sequelize.define('Imoveis', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: true
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  tipo: {
    type: DataTypes.ENUM('aluguel', 'venda'),
    allowNull: true
  },
  quartos: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  garagens: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  suites: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  preco: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  cidade: {
    type: DataTypes.STRING,
    allowNull: true
  },
  bairro: {
    type: DataTypes.STRING,
    allowNull: true
  },
  rua: {
    type: DataTypes.STRING,
    allowNull: true
  },
  tipoImovel: {
    type: DataTypes.ENUM('apartamento', 'casa', 'terreno', 'sala-escritorio', 'loja', 'galpao', 'imovel-rural'),
    allowNull: true
  },
  areaUtil: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  areaTotal: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  status: {
    type: DataTypes.STRING,
    allowNull: true
  },
  idUsuario: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  fotos: {
    type: DataTypes.JSON,
    // Alterado para armazenar os nomes dos arquivos das imagens
    allowNull: true
  },
  ordemFotos: {
    type: DataTypes.JSON,
    // Mantido como está
    allowNull: true
  }
});
Imoveis.salvarImagens = async function (imovelId, fotos) {
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
  await Imoveis.update({
    fotos: fotos.map(foto => foto.name)
  }, {
    where: {
      id: imovelId
    }
  });
};
module.exports = Imoveis;

/***/ }),

/***/ "./src/Back-End/back/models/User.js":
/*!******************************************!*\
  !*** ./src/Back-End/back/models/User.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// models/User.js
const {
  DataTypes
} = __webpack_require__(/*! sequelize */ "sequelize");
const sequelize = __webpack_require__(/*! ../config/database */ "./src/Back-End/back/config/database.js");
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true
  }
});
module.exports = User;

/***/ }),

/***/ "./src/Back-End/back/passport.js":
/*!***************************************!*\
  !*** ./src/Back-End/back/passport.js ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// passport.js

const passport = __webpack_require__(/*! passport */ "passport");
const LocalStrategy = (__webpack_require__(/*! passport-local */ "passport-local").Strategy);
const JwtStrategy = (__webpack_require__(/*! passport-jwt */ "passport-jwt").Strategy);
const ExtractJwt = (__webpack_require__(/*! passport-jwt */ "passport-jwt").ExtractJwt);
const bcrypt = __webpack_require__(/*! bcrypt */ "bcrypt");
const User = __webpack_require__(/*! ./models/User */ "./src/Back-End/back/models/User.js"); // Importe o modelo de usuário adequado

// Configuração da estratégia local (username/password)
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  try {
    const user = await User.findOne({
      email
    });
    if (!user) {
      return done(null, false, {
        message: 'Incorrect email'
      });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return done(null, false, {
        message: 'Incorrect password'
      });
    }
    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'seu_segredo' // Sua chave secreta para verificar o token
};
passport.use(new JwtStrategy(options, async (payload, done) => {
  try {
    const user = await User.findById(payload.userId);
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (error) {
    return done(error, false);
  }
}));
module.exports = passport;

/***/ }),

/***/ "./src/Back-End/back/routes/authRoutes.js":
/*!************************************************!*\
  !*** ./src/Back-End/back/routes/authRoutes.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// authRouter.js
const express = __webpack_require__(/*! express */ "express");
const router = express.Router();
const authController = __webpack_require__(/*! ../controllers/authController */ "./src/Back-End/back/controllers/authController.js");
const {
  authenticateJWT
} = __webpack_require__(/*! ../middleware/authMiddleware */ "./src/Back-End/back/middleware/authMiddleware.js");
router.post('/cadastrar', authController.registerUser);
router.post('/login', authController.loginUser);
router.get('/usuario', authenticateJWT, (req, res) => {
  res.json({
    user: req.user
  });
});
router.put('/usuario', authenticateJWT, authController.updateUser);
module.exports = router;

/***/ }),

/***/ "./src/Back-End/back/routes/imoveis.js":
/*!*********************************************!*\
  !*** ./src/Back-End/back/routes/imoveis.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// routes/imoveis.js

const express = __webpack_require__(/*! express */ "express");
const router = express.Router();
const ImovelController = __webpack_require__(/*! ../controllers/ImovelController */ "./src/Back-End/back/controllers/ImovelController.js");
const Imoveis = __webpack_require__(/*! ../models/Imovel */ "./src/Back-End/back/models/Imovel.js");
const path = __webpack_require__(/*! path */ "./node_modules/path-browserify/index.js");
const db = __webpack_require__(/*! ../config/database */ "./src/Back-End/back/config/database.js");
const sequelize = db.sequelize; // Acessando o objeto sequelize

// Rota para lidar com o envio de dados do formulário e criar um novo imóvel
router.post('/', async (req, res) => {
  try {
    const imovelData = req.body;
    const novoImovel = await Imoveis.create(imovelData);
    res.status(201).json(novoImovel);
  } catch (error) {
    console.error('Erro ao cadastrar imóvel:', error);
    res.status(500).json({
      error: 'Erro ao cadastrar imóvel'
    });
  }
});
router.get('/buscar', async (req, res) => {
  try {
    // Extrair os parâmetros de busca da query da requisição
    const {
      tipo,
      cidade,
      precoMinimo,
      precoMaximo,
      quartos,
      suites,
      garagens,
      tipoImovel
    } = req.query;
    let whereClause = {};
    if (tipo) whereClause.tipo = tipo;
    if (cidade) whereClause.cidade = cidade;
    const precoMinimoInt = parseInt(precoMinimo);
    const precoMaximoInt = parseInt(precoMaximo);
    if (!isNaN(precoMinimoInt) && !isNaN(precoMaximoInt)) {
      // Construir a cláusula WHERE do filtro de preço
      whereClause.preco = {
        [db.Sequelize.Op.between]: [precoMinimoInt, precoMaximoInt]
      };
    } else if (!isNaN(precoMinimoInt)) {
      whereClause.preco = {
        [db.Sequelize.Op.gte]: precoMinimoInt
      };
    } else if (!isNaN(precoMaximoInt)) {
      whereClause.preco = {
        [db.Sequelize.Op.lte]: precoMaximoInt
      };
    }
    const quartosInt = parseInt(quartos);
    const suitesInt = parseInt(suites);
    const garagensInt = parseInt(garagens);
    if (quartosInt == 5) {
      whereClause.quartos = {
        [db.Sequelize.Op.gte]: quartosInt
      };
    } else if (quartos) {
      whereClause.quartos = parseInt(quartos);
    }
    if (suitesInt == 5) {
      whereClause.quartos = {
        [db.Sequelize.Op.gte]: suitesInt
      };
    } else if (suites) {
      whereClause.suites = parseInt(suites);
    }
    if (garagensInt == 5) {
      whereClause.quartos = {
        [db.Sequelize.Op.gte]: garagensInt
      };
    } else if (garagens) {
      whereClause.suites = parseInt(garagens);
    }
    if (tipoImovel) whereClause.tipoImovel = tipoImovel;
    const imoveisFiltrados = await Imoveis.findAll({
      where: whereClause
    });
    console.log(typeof imoveisFiltrados); // Verifica o tipo de dados retornado

    // Retornar os imóveis filtrados como resposta
    res.status(200).json(imoveisFiltrados);
  } catch (error) {
    console.error('Erro ao buscar imóveis:', error);
    res.status(500).json({
      error: 'Erro ao buscar imóveis'
    });
  }
});

// Rota para obter detalhes de um imóvel específico
router.get('/:id', async (req, res) => {
  try {
    const imovel = await Imoveis.findByPk(req.params.id);
    if (!imovel) {
      return res.status(404).json({
        message: 'Imóvel não encontrado'
      });
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
    res.status(500).json({
      error: 'Erro ao obter detalhes do imóvel'
    });
  }
});
router.put('/:id', async (req, res) => {
  try {
    const imovel = await Imoveis.findByPk(req.params.id);
    if (imovel) {
      await imovel.update(req.body);
      res.status(200).json(imovel);
    } else {
      res.status(404).json({
        error: 'Imóvel não encontrado'
      });
    }
  } catch (error) {
    console.error('Erro ao editar imóvel:', error);
    res.status(500).json({
      error: 'Erro ao editar imóvel'
    });
  }
});

// Rotas adicionais para operações CRUD de imóveis utilizando ImovelController
router.get('/', ImovelController.list); // Listar todos os imóveis
router.put('/:id', ImovelController.update); // Atualizar um imóvel existente
router.delete('/:id', ImovelController.delete); // Excluir um imóvel existente

module.exports = router;

/***/ }),

/***/ "./src/Back-End/back/routes/userRoutes.js":
/*!************************************************!*\
  !*** ./src/Back-End/back/routes/userRoutes.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const express = __webpack_require__(/*! express */ "express");
const router = express.Router();
const {
  User
} = __webpack_require__(/*! ../models/User */ "./src/Back-End/back/models/User.js");
const Imovel = __webpack_require__(/*! ../models/Imovel */ "./src/Back-End/back/models/Imovel.js"); // Importe o modelo do Imóvel

// Rota para obter as informações do usuário com base no ID
router.get('/api/usuario/:userId', async (req, res) => {
  try {
    // Recuperar o ID do usuário a partir dos parâmetros da URL
    const userId = req.params.userId;

    // Buscar as informações do usuário com base no ID
    const user = await User.findByPk(userId);
    if (!user) {
      // Se o usuário não for encontrado, retornar um erro 404
      return res.status(404).json({
        message: 'Usuário não encontrado'
      });
    }

    // Retornar as informações do usuário como JSON
    res.json({
      nome: user.nome,
      email: user.email
    });
  } catch (error) {
    // Se ocorrer um erro, retornar um erro 500
    console.error('Erro ao buscar informações do usuário:', error);
    res.status(500).json({
      message: 'Erro interno do servidor'
    });
  }
});
router.get('/api/imoveis/usuario/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    // Faça aqui a lógica para buscar os imóveis do usuário com o ID fornecido
    // Por exemplo, você pode usar o modelo Imovel para encontrar os imóveis associados a esse usuário
    const userImoveis = await Imovel.find({
      idUsuario: userId
    });
    res.json(userImoveis);
  } catch (error) {
    console.error('Erro ao buscar os imóveis do usuário:', error);
    res.status(500).json({
      error: 'Erro ao buscar os imóveis do usuário'
    });
  }
});
module.exports = router;

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
var __dirname = "/";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var path_browserify__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! path-browserify */ "path-browserify");
/* harmony import */ var path_browserify__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(path_browserify__WEBPACK_IMPORTED_MODULE_0__);
/* module decorator */ module = __webpack_require__.hmd(module);
//index.js

const express = __webpack_require__(/*! express */ "express");
const path = __webpack_require__(/*! path */ "./node_modules/path-browserify/index.js");
const cors = __webpack_require__(/*! cors */ "cors");
const bcrypt = __webpack_require__(/*! bcrypt */ "bcrypt");
// const multer = require('multer');
const authRouter = __webpack_require__(/*! ./Back-End/back/routes/authRoutes */ "./src/Back-End/back/routes/authRoutes.js"); // Importe as suas rotas de autenticação
const imoveisRouter = __webpack_require__(/*! ./Back-End/back/routes/imoveis */ "./src/Back-End/back/routes/imoveis.js");
const bodyParser = __webpack_require__(/*! body-parser */ "body-parser");
const authController = __webpack_require__(/*! ./Back-End/back/controllers/authController */ "./src/Back-End/back/controllers/authController.js"); // Importe o controlador de autenticação
const User = __webpack_require__(/*! ./Back-End/back/models/User */ "./src/Back-End/back/models/User.js");
const passport = __webpack_require__(/*! ./Back-End/back/passport */ "./src/Back-End/back/passport.js");
const {
  verificarTokenEObterDetalhesUsuario
} = __webpack_require__(/*! ./Back-End/back/middleware/authMiddleware */ "./src/Back-End/back/middleware/authMiddleware.js");
const usuarioRouter = __webpack_require__(/*! ./Back-End/back/routes/userRoutes */ "./src/Back-End/back/routes/userRoutes.js");
const {
  authenticateJWT
} = __webpack_require__(/*! ./Back-End/back/middleware/authMiddleware */ "./src/Back-End/back/middleware/authMiddleware.js");
const {
  authenticateJWTImovelUser
} = __webpack_require__(/*! ./Back-End/back/middleware/authMiddleware */ "./src/Back-End/back/middleware/authMiddleware.js");
const imoveisImagemRouter = __webpack_require__(/*! ./Back-End/back/routes/imoveis */ "./src/Back-End/back/routes/imoveis.js"); // Importe o arquivo de rota de imagens de imóveis
const Imovel = __webpack_require__(/*! ./Back-End/back/models/Imovel */ "./src/Back-End/back/models/Imovel.js");
const cookieParser = __webpack_require__(/*! cookie-parser */ "cookie-parser");
const app = express();
const PORT = process.env.PORT || 3000; // Define a porta do servidor

app.use(passport.initialize());
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, 'src')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
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
app.get('/cadastroImovel', authenticateJWT, (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'pages', 'cadastro.html'));
});
app.get('/cadastroImovelUser', authenticateJWTImovelUser, (req, res) => {
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
app.get('/analise', authenticateJWT, (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'pages', 'analise.html'));
});
app.get('/seusImoveis', authenticateJWTImovelUser, (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'pages', 'imoveisUser.html'));
});
app.get('/api/imoveis/usuario/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const userImoveis = await Imovel.find({
      idUsuario: userId
    });
    res.json(userImoveis);
  } catch (error) {
    console.error('Erro ao buscar os imóveis do usuário:', error);
    res.status(500).json({
      error: 'Erro ao buscar os imóveis do usuário'
    });
  }
});
app.get('/api/user/id', authenticateJWT, (req, res) => {
  const userId = req.user.id;
  res.json({
    userId
  });
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
      return res.status(404).json({
        message: 'Usuário não encontrado'
      });
    }

    // Retornar as informações do usuário como JSON
    res.json(user);
  } catch (error) {
    console.error('Erro ao buscar informações do usuário:', error);
    res.status(500).json({
      message: 'Erro interno do servidor'
    });
  }
});
app.get('/editarImovel', authenticateJWT, (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'pages', 'editaImovel.html'));
});

// Rota para obter os dados de um imóvel pelo ID
app.get('/api/imoveis/:id', async (req, res) => {
  try {
    const imovelId = req.params.id;
    const imovel = await Imovel.findByPk(imovelId);
    if (!imovel) {
      return res.status(404).json({
        error: 'Imóvel não encontrado'
      });
    }

    // Converte as fotos para o formato esperado se necessário
    if (imovel.fotos && !Array.isArray(imovel.fotos)) {
      imovel.fotos = [imovel.fotos];
    }
    res.status(200).json(imovel);
  } catch (error) {
    console.error('Erro ao obter detalhes do imóvel:', error);
    res.status(500).json({
      error: 'Erro interno do servidor ao buscar detalhes do imóvel'
    });
  }
});

// Rota para editar os dados de um imóvel
app.put('/api/imoveis/:id', async (req, res) => {
  const {
    id
  } = req.params;
  const {
    titulo,
    descricao,
    tipo,
    tipoImovel,
    quartos,
    garagens,
    suites,
    preco,
    cidade,
    bairro,
    rua,
    status
  } = req.body;
  try {
    const imovel = await Imovel.findByPk(id); // Supondo que você tenha um modelo Imovel
    if (!imovel) {
      return res.status(404).json({
        message: 'Imóvel não encontrado'
      });
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
    res.status(200).json({
      message: 'Imóvel atualizado com sucesso!',
      imovel
    });
  } catch (error) {
    console.error('Erro ao atualizar imóvel:', error);
    res.status(500).json({
      message: 'Erro interno do servidor'
    });
  }
});
app.get('/editaUser', (req, res) => {
  res.render('editaUser'); // Renderiza a página de edição de informações
});

// Rota para editar informações do usuário
app.post('/api/editarUsuario', async (req, res) => {
  try {
    const userId = req.cookies.userId; // Obtém o ID do usuário autenticado
    const {
      username,
      phone,
      password
    } = req.body; // Obtém os novos dados do usuário a serem atualizados

    // Verifica se o usuário existe no banco de dados
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        message: 'Usuário não encontrado'
      });
    }

    // Verifica se a senha fornecida pelo usuário está correta
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({
        message: 'Senha incorreta. Não é possível atualizar as informações do usuário.'
      });
    }

    // Verifica se o novo nome de usuário já está em uso por outro usuário
    const existingUsername = await User.findOne({
      where: {
        username
      }
    });
    if (existingUsername && existingUsername.id !== req.cookies.userId) {
      return res.status(400).json({
        message: 'Nome de usuário já em uso. Escolha outro.'
      });
    }

    // Verifica se o novo número de telefone já está em uso por outro usuário
    const existingPhone = await User.findOne({
      where: {
        phone
      }
    });
    if (existingPhone && existingPhone.id !== req.cookies.userId) {
      return res.status(400).json({
        message: 'Número de telefone já em uso. Escolha outro.'
      });
    }

    // Atualiza as informações do usuário no banco de dados
    user.username = username;
    user.phone = phone;
    await user.save();

    // Retorna uma resposta de sucesso
    return res.status(200).json({
      message: 'Informações do usuário atualizadas com sucesso!',
      user
    });
  } catch (error) {
    console.error('Erro ao atualizar informações do usuário:', error);
    return res.status(500).json({
      message: 'Erro interno do servidor'
    });
  }
});
app.get('/editaSenha', (req, res) => {
  res.render('editaSenha'); // Renderiza a página de edição de senha
});

// Rota para atualizar a senha do usuário
app.post('/api/editarSenha', async (req, res) => {
  try {
    const userId = req.cookies.userId; // Obtém o ID do usuário autenticado
    const {
      oldPassword,
      newPassword,
      confirmPassword
    } = req.body; // Obtém as senhas fornecidas

    // Verifica se a nova senha e a confirmação são iguais
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: 'A nova senha e a confirmação de senha não coincidem.'
      });
    }

    // Verifica se o usuário existe no banco de dados
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        message: 'Usuário não encontrado'
      });
    }

    // Verifica se a senha antiga fornecida pelo usuário está correta
    const passwordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!passwordMatch) {
      return res.status(401).json({
        message: 'Senha antiga incorreta. Não é possível atualizar a senha.'
      });
    }

    // Criptografa a nova senha
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Atualiza a senha do usuário no banco de dados
    user.password = hashedPassword;
    await user.save();

    // Retorna uma resposta de sucesso
    return res.status(200).json({
      message: 'Senha atualizada com sucesso!'
    });
  } catch (error) {
    console.error('Erro ao atualizar a senha:', error);
    return res.status(500).json({
      message: 'Erro interno do servidor'
    });
  }
});
const server = app.listen(PORT, () => {
  console.log("Servidor iniciado na porta ".concat(PORT));
});
module.exports = {
  app,
  server
};

/***/ }),

/***/ "bcrypt":
/*!*************************!*\
  !*** external "bcrypt" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("bcrypt");

/***/ }),

/***/ "body-parser":
/*!******************************!*\
  !*** external "body-parser" ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = require("body-parser");

/***/ }),

/***/ "cookie-parser":
/*!********************************!*\
  !*** external "cookie-parser" ***!
  \********************************/
/***/ ((module) => {

"use strict";
module.exports = require("cookie-parser");

/***/ }),

/***/ "cors":
/*!***********************!*\
  !*** external "cors" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("cors");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/***/ ((module) => {

"use strict";
module.exports = require("express");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ "jsonwebtoken":
/*!*******************************!*\
  !*** external "jsonwebtoken" ***!
  \*******************************/
/***/ ((module) => {

"use strict";
module.exports = require("jsonwebtoken");

/***/ }),

/***/ "passport":
/*!***************************!*\
  !*** external "passport" ***!
  \***************************/
/***/ ((module) => {

"use strict";
module.exports = require("passport");

/***/ }),

/***/ "passport-jwt":
/*!*******************************!*\
  !*** external "passport-jwt" ***!
  \*******************************/
/***/ ((module) => {

"use strict";
module.exports = require("passport-jwt");

/***/ }),

/***/ "passport-local":
/*!*********************************!*\
  !*** external "passport-local" ***!
  \*********************************/
/***/ ((module) => {

"use strict";
module.exports = require("passport-local");

/***/ }),

/***/ "path-browserify":
/*!**********************************!*\
  !*** external "path-browserify" ***!
  \**********************************/
/***/ ((module) => {

"use strict";
module.exports = require("path-browserify");

/***/ }),

/***/ "sequelize":
/*!****************************!*\
  !*** external "sequelize" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("sequelize");

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, ["vendors"], () => (__webpack_exec__("./src/index.js")));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);
//# sourceMappingURL=main.0be64094ba52d4f5df33.js.map