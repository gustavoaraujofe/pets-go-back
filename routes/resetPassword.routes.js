const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserModel = require("../models/User.model");
const VetModel = require("../models/Vet.model");

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "gustavoaraujofe1@gmail.com",
    pass: "*****",
  },
});

const salt_rounds = 10;

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    let user = await UserModel.findOne({ email });

    if (!user) {
      user = await VetModel.findOne({ email });
    }

    if (!user) {
      return res.status(400).json({ msg: "Usuário não encontrado" });
    }

    const temporaryToken = jwt.sign(
      { _id: user._id },
      process.env.SIGN_SECRET_RESET_PASSWORD,
      {
        expiresIn: "20m",
      }
    );

    if (user.role === "vet") {
      await VetModel.findOneAndUpdate(
        { _id: user._id },
        { $set: { resetPassword: temporaryToken } }
      );
    }

    if (user.role === "user") {
      await UserModel.findOneAndUpdate(
        { _id: user._id },
        { $set: { resetPassword: temporaryToken } }
      );
    }

    const mailOptions = {
      from: "gustavoaraujofe1@gmail.com",
      to: user.email,
      subject: "Redefinir senha",
      html: `<p>Clique no link para redefinir sua senha:<p> <a href=http://localhost:4000/api/v1/password/reset-password/${temporaryToken}>LINK</a>`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "Erro no envio do e-mail" });
      }
    });

    res.status(200).json({ message: "E-mail enviado com sucesso" });
  } catch (err) {
    console.error(err);
  }
});

router.put("/reset-password/:token", async (req, res) => {
  try {
    if (!req.params.token) {
      return res.status(400).json({ msg: "Falha na autenticação!" });
    }

    let user = await UserModel.findOne({ resetPassword: req.params.token });

    if (!user) {
      user = await VetModel.findOne({ resetPassword: req.params.token });
    }

    if (!user) {
      return res.status(400).json({ msg: "Usuário não encontrado" });
    }

    const { newPassword } = req.body;

    if (
      !newPassword ||
      !newPassword.match(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/
      )
    ) {
      return res.status(400).json({
        msg: "Password is required and must have at least 8 characters, uppercase and lowercase letters, numbers and special characters.",
      });
    }

    const salt = await bcrypt.genSalt(salt_rounds);

    const hashedPassword = await bcrypt.hash(newPassword, salt);

    if (user.role === "vet") {
      await VetModel.findOneAndUpdate(
        { _id: user._id },
        { $set: { passwordHash: hashedPassword, resetPassword: "" } }
      );
    }

    if (user.role === "user") {
      await UserModel.findOneAndUpdate(
        { _id: user._id },
        { $set: { passwordHash: hashedPassword, resetPassword: "" } }
      );
    }
    res.status(200).json({ message: "Senha redefinida com sucesso" });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
