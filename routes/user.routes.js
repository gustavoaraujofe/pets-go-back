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
  console.log(req.file);
  
  if (!req.file) 
  {
    return res.status(500).json({ msg: "Upload de arquivo falhou." });
  }


  return res.status(200).json({ url: req.file.path });
});

// Criar um novo usuário

router.post("/signup", async (req, res) => {
  try {
    const { password } = req.body;

    if (
      !password ||
      !password.match(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/
      )
    ) {
      return res.status(400).json({
        msg: "A senha é obrigatória e deve ter pelo menos 8 caracteres, letras maiúsculas e minúsculas, números e caracteres especiais.",
      });
    }

    const salt = await bcrypt.genSalt(salt_rounds);

    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await UserModel.create({
      ...req.body,
      passwordHash: hashedPassword,
    });

    return res.status(201).json(result);
  } catch (err) {
    console.error(err);

    // No moongoose, o erro 11000 é um erro de validação do modelo
    if(err.code === 11000) {
      return res.status(400).json(err.message)
    }

    return res.status(500).json({ msg: JSON.stringify(err) });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ msg: "Este email ainda não está cadastrado em nosso site." });
    }

    if (await bcrypt.compare(password, user.passwordHash)) {
      const token = generateToken(user);

      res.status(200).json({
        token: token,
        user: {
          name: user.name,
          email: user.email,
          role: user.role,
          id: user._id,
        },
      });
    } else {
      return res.status(401).json({ msg: "Senha ou email errado." });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: JSON.stringify(err) });
  }
});

// Buscar dados do usuário
router.get("/profile", isAuthenticated, attachCurrentUser, (req, res) => {
  try {
    const loggedInUser = req.currentUser;

    if (loggedInUser) {
      return res.status(200).json(loggedInUser)
    } else {
      return res.status(404).json({ msg: "Usuário não encontrado." });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: JSON.stringify(err) });
  }
});

router.get("/profile/:id", isAuthenticated, async (req, res) => {
  try {
    
    console.log(req.params.id)
    if (req.params.id) {
      
      const user = await UserModel.findOne({_id: req.params.id});
      console.log(user)
      return res.status(200).json(user)
    } else {
      return res.status(404).json({ msg: "Usuário não encontrado." });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: JSON.stringify(err) });
  }
});

//Atualizar dados do usuario
router.patch("/edit", isAuthenticated, attachCurrentUser, async (req, res) => {
  try {
    const updateUser = await UserModel.findOneAndUpdate(
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
});

//Deletar usuário
router.delete(
  "/delete",
  isAuthenticated,
  attachCurrentUser,
  async (req, res) => {
    try {
      const response = await UserModel.deleteOne({ _id: req.currentUser });

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
