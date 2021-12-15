const express = require("express");
const uploader = require("../config/cloudinary.config");
const AnimalModel = require("../models/Animal.model");
const isAuthenticated = require("../middlewares/isAuthenticated");
const attachCurrentUser = require("../middlewares/attachCurrentUser");
const UserModel = require("../models/User.model");

const router = express.Router();

// Upload
router.post(
  "/upload",
  isAuthenticated,
  attachCurrentUser,
  uploader.single("picture"),
  (req, res) => {
    if (!req.file) {
      return res.status(500).json({ msg: "Upload de arquivo falhou." });
    }

    return res.status(201).json({ url: req.file.path });
  }
);

// POST
router.post("/create", isAuthenticated, attachCurrentUser, async (req, res) => {
  try {
    const result = await AnimalModel.create(req.body);

    res.status(201).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// GET (Busca detalhada)
router.get(
  "/search/:id",
  isAuthenticated,
  attachCurrentUser,
  async (req, res) => {
    try {
      const result = await AnimalModel.findOne({ _id: req.params.id });

      if (!result) {
        return res.status(404).json("Animal não encontrado");
      }

      res.status(200).json(result);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }
);

// Lista de Animais do usuário
router.get("/list", isAuthenticated, attachCurrentUser, async (req, res) => {
  try {
    console.log(req.currentUser._id);
    const animals = await AnimalModel.find();

    res.status(200).json(animals);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// PATCH (Editar)
router.patch(
  "/edit/:id",
  isAuthenticated,
  attachCurrentUser,
  async (req, res) => {
    try {
      const result = await AnimalModel.findOneAndUpdate(
        { _id: req.params.id },
        { $set: req.body },
        { new: true, runValidators: true }
      );

      if (!result) {
        return res.status(404).json({ msg: "Animal não encontrado" });
      }

      res.status(200).json(result);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }
);

// DELETE
router.delete(
  "/delete/:id",
  isAuthenticated,
  attachCurrentUser,
  async (req, res) => {
    try {
      const result = await AnimalModel.deleteOne({ _id: req.params.id });
      res.status(200).json({});
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }
);

module.exports = router;
