const express = require("express");

const router = express.Router();
const queryModel = require("../models/MedicalAppointment.model");
const isAuthenticated = require("../middlewares/isAuthenticated");
const attachCurrentUser = require("../middlewares/attachCurrentUser");

//Criar consulta médica
router.post("/create", async (req, res) => {
  try {
    const result = await queryModel.create(req.body);
    res.status(201).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Lista de Prontuários
router.get("/list", isAuthenticated, attachCurrentUser, async (req, res) => {
  try {
    console.log(req.currentUser._id)
    const result = await queryModel.find();


    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//Buscar consulta médica
router.get("/search/:id", async (req, res) => {
  try {
    const query = await queryModel.findOne({ _id: req.params.id });

    if (!query) {
      return res.status(404).json("Consulta não encontrada.");
    }

    res.status(200).json(query);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//Editar consulta médica
router.patch("/edit/:id", async (req, res) => {
  try {
    const result = await queryModel.findOneAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { new: true, runValitadors: true }
    );

    if (!result) {
      return res.status(404).json({ msg: "Consulta não encontrada." });
    }

    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//Editar consulta médica
router.put("/edit/:id", async (req, res) => {
  try {
    const result = await queryModel.findOneAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { new: true, runValitadors: true }
    );

    if (!result) {
      return res.status(404).json({ msg: "Consulta não encontrada." });
    }

    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// DELETE
router.delete(
  "/delete/:id",
  isAuthenticated,
  attachCurrentUser,
  async (req, res) => {
    try {
      const result = await queryModel.deleteOne({ _id: req.params.id });
      res.status(200).json({});
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }
);

module.exports = router;
