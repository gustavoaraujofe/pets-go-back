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
  if (!req.file) {
    return res.status(500).json({ msg: "Upload de arquivo falhou." });
  }

  return res.status(201).json({ url: req.file.path });
});

// Criar um novo usuário
router.post("/signup", async (req, res) => {
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

    res.status(200).json({
      token: token,
      user: {
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
        id: foundUser._id,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//Busca por um veterinario
router.get("/profile", isAuthenticated, attachCurrentUser, (req, res) => {
  try {
    const loggedInUser = req.currentUser;

    if (loggedInUser) {
      return res.status(200).json(loggedInUser);
    } else {
      return res.status(404).json({ msg: "Usuário não encontrado." });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: JSON.stringify(err) });
  }
});

//Listar veterinários
router.get("/list", isAuthenticated, async (req, res) => {
  try {
    const response = await VetModel.find();

    if (response) {
      return res.status(200).json(response);
    } else {
      return res.status(404).json({ msg: "Usuário não encontrado." });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: JSON.stringify(err) });
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

router.patch(
  "/schedule",
  isAuthenticated,
  attachCurrentUser,
  async (req, res) => {
    const response = await VetModel.findOneAndUpdate(
      { _id: req.user._id },
      { $push: { schedule: req.body } },
      { new: true, runValidators: true }
    );
    res.status(200).json(response);
  }
);

router.get("/schedule/list/:id", async (req, res) => {
  try {
    const response = await VetModel.findOne({ _id: req.params.id });
    
    const date = new Date().toLocaleDateString("pt-BR")
    console.log(new Date())
    await response.schedule.map((currentWeek, i) => {
      for (let key in currentWeek) {
        if (key < date) {
          delete currentWeek[key];
        }

        if (key === date) {
          let hour = new Date().toLocaleTimeString("pt-BR");

          const arrClone = [...currentWeek[key]];

          arrClone.forEach((day) => {
            if (day.split(":")[0] <= hour.split(":")[0]) {
              let index = currentWeek[key].indexOf(day);
              currentWeek[key].splice(index, 1);
            }
          });
        }

        if (!currentWeek[key]?.length) {
          delete currentWeek[key];
        }
      }

      if (Object.keys(currentWeek).length === 0) {
        response.schedule.splice(i, 1);
      }
    });

    await VetModel.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { schedule: response.schedule } },
      { new: true, runValidators: true }
    );

    res.status(200).json(response.schedule);
  } catch (err) {
    console.error(err);
  }
});

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
