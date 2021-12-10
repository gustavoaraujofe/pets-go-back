const router = require("express").Router();
const bcrypt = require("bcryptjs");

const VetModel = require("../models/Vet.model");
const generateToken = require("../config/jwt.config");
const isAuthenticated = require("../middlewares/isAuthenticated");
const attachCurrentUser = require("../middlewares/attachCurrentUser");
const uploader = require("../config/cloudinary.config");

const salt_rounds = 10;



//Upload de arquivos no Cloudinary
router.post("/upload", uploader.single("picture"), (req, res) => {
  console.log(req.file);
  if (!req.file) {
    return res.status(500).json({ msg: "Upload de arquivo falhou." });
  }
  console.log(req.file);

  return res.status(201).json({ url: req.file.path });
});

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
        msg: "Password is required and must have at least 8 characters, uppercase and lowercase letters, numbers and special characters.",
      });
    }
    // Gera o salt
    const salt = await bcrypt.genSalt(salt_rounds);
    // Criptografa a senha
    const hashedPassword = await bcrypt.hash(password, salt);
    // Salva os dados de usuário no banco de dados (MongoDB) usando o body da requisição como parâmetro
    const result = await VetModel.create({
      ...req.body,
      passwordHash: hashedPassword,
    });
    // Responder o usuário recém-criado no banco para o cliente (solicitante). O status 201 significa Created
    return res.status(201).json(result);
  } catch (err) {
    console.error(err);
    // O status 500 signifca Internal Server Error
    return res.status(500).json({ msg: JSON.stringify(err) });
  }
});

//Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const foundUser = await VetModel.findOne({ email });

    if (!foundUser) {
      return res.status(400).json({ msg: "E-mail ou senha incorretos." });
    }

    if (!bcrypt.compareSync(password, foundUser.passwordHash)) {
      return res.status(400).json({ msg: "E-mail ou senha incorretos." });
    }

    const token = generateToken(foundUser);

    res.status(200).json({ token: token });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//Update
router.patch(
  "/edit-vet",
  isAuthenticated,
  attachCurrentUser,
  async (req, res) => {
    try {
      const updateUser = await VetModel.findOneAndUpdate(
        { _id: req.user._id },
        { $set: req.body },
        { new: true, runValidators: true }
      );

      if (!updateUser) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      res.status(200).json(updateUser);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }
);

//Delete
router.delete(
  "/delete",
  isAuthenticated,
  attachCurrentUser,
  async (req, res) => {
    try {
      const response = await VetModel.deleteOne({ _id: req.currentUser });

      if (response) {
        return res.status(200).json(response);
      } else {
        return res.status(404).json({ msg: "Usuário não encontrado" });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: JSON.stringify(err) });
    }
  }
);

module.exports = router;