const router = require("express").Router();
const bcrypt = require("bcryptjs");

const uploader = require("../config/cloudinary.config");

const UserModel = require("../models/User.model");
const generateToken = require("../config/jwt.config");
const isAuthenticated = require("../middlewares/isAuthenticated");
const attachCurrentUser = require("../middlewares/attachCurrentUser");

const salt_rounds = 10;

// Upload do avatar

router.post("/upload", uploader.single("picture"), (req, res) => {
  if (!req.file) {
    return res.status(500).json({msg: "Upload de arquivo falhou."})
  }

  console.log(req.file)

  return res.status(200).json({url:req.file.path})
})

// Crud (CREATE) - HTTP POST
// Criar um novo usuário

router.post("/signup", async (req, res) => {
  
  console.log(req.body);
  try {
    // Recuperar a senha que está vindo do corpo da requisição
    const { password } = req.body;

    // Verifica se a senha não está em branco ou se a senha não é complexa o suficiente
    if (
      !password ||
      !password.match(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/
      )
    ) {
    // O código 400 significa Bad Request
      return res.status(400).json({
        msg: "A senha é obrigatória e deve ter pelo menos 8 caracteres, letras maiúsculas e minúsculas, números e caracteres especiais."
      });
    }

    // Gera o salt
    const salt = await bcrypt.genSalt(salt_rounds);

    // Criptografa a senha
    const hashedPassword = await bcrypt.hash(password, salt);

    // Salva os dados de usuário no banco de dados
    const result = await UserModel.create({
      ...req.body,
      passwordHash: hashedPassword,
    });

    // Responder o usuário recém-criado no banco para o cliente (solicitante)
    return res.status(201).json(result);
  } catch (err) {
    console.error(err);
    // O status 500 signifca Internal Server Error
    return res.status(500).json({ msg: JSON.stringify(err) });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    // Extraindo o email e senha do corpo da requisição
    const { email, password } = req.body;

    // Pesquisar esse usuário no banco pelo email
    const user = await UserModel.findOne({ email });

    console.log(user);

    // Se o usuário não foi encontrado, significa que ele não é cadastrado
    if (!user) {
      return res
        .status(400)
        .json({ msg: "Este email ainda não está cadastrado em nosso site." });
    }

    // Verificar se a senha do usuário pesquisado bate com a senha recebida pelo formulário

    if (await bcrypt.compare(password, user.passwordHash)) {
      // Gerando o JWT com os dados do usuário que acabou de logar
      const token = generateToken(user);

      return res.status(200).json(token);
      
    } else {
      // 401 Significa Unauthorized
      return res.status(401).json({ msg: "Senha ou email errado." });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: JSON.stringify(err) });
  }
});

// cRud (READ) - HTTP GET
// Buscar dados do usuário
router.get("/profile", isAuthenticated, attachCurrentUser, (req, res) => {
  console.log(req.headers);

  try {
    // Buscar o usuário logado que está disponível através do middleware attachCurrentUser
    const loggedInUser = req.currentUser;

    if (loggedInUser) {
      // Responder o cliente com os dados do usuário. O status 200 significa OK
      return res.status(200).json(loggedInUser);
    } else {
      return res.status(404).json({ msg: "Usuário não encontrado." });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: JSON.stringify(err) });
  }
});

module.exports = router;