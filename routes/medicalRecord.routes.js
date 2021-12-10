const router = require("express").Router();

const MedicalRecordModel = require("../models/MedicalRecord.model");

const isAuthenticated = require("../middlewares/isAuthenticated");
const attachCurrentUser = require("../middlewares/attachCurrentUser");

// Criar um novo usuário
router.post("/create", isAuthenticated, attachCurrentUser, async (req, res) => {
  console.log(req.body);
  try {
    const result = await MedicalRecordModel.create(req.body);
    // Responder o usuário recém-criado no banco para o cliente (solicitante).
    return res.status(201).json(result);
  } catch (err) {
    console.error(err);
    // O status 500 significa Internal Server Error
    return res.status(500).json({ msg: JSON.stringify(err) });
  }
});

//Busca por um prontuário
router.get(
  "/search/:id",
  isAuthenticated,
  attachCurrentUser,
  async (req, res) => {
    try {
      const response = await MedicalRecordModel.findOne({ _id: req.params.id });

      res.status(200).json(response);
    } catch (err) {
      console.log(err);
      res.status(404).json({ message: "Prontuário não encontrado" });
    }
  }
);

//UPDATE
router.patch(
  "/edit/:id",
  isAuthenticated,
  attachCurrentUser,
  async (req, res) => {
    try {
      console.log(req.params.id);
      const response = await MedicalRecordModel.findOneAndUpdate(
        { _id: req.params.id },
        { $push: req.body },
        { new: true, runValidators: true }
      );

      res.status(200).json(response);
    } catch (err) {
      console.log(err);
      res.status(404).json({ message: "Prontuário não encontrado" });
    }
  }
);

//Deletar prontuário
router.delete(
  "/delete/:id",
  isAuthenticated,
  attachCurrentUser,
  async (req, res) => {
    try {
      console.log(req.params.id);
      const response = await MedicalRecordModel.deleteOne({
        _id: req.params.id,
      });

      if (response) {
        return res.status(200).json(response);
      } else {
        return res.status(404).json({ msg: "Prontuário não encontrado" });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: JSON.stringify(err) });
    }
  }
);

module.exports = router;
