const router = require("express").Router();

const UserModel = require("../models/User.model");
const VetModel = require("../models/Vet.model");
const AppointmentModel = require("../models/Appointment.model");

const isAuthenticated = require("../middlewares/isAuthenticated");
const attachCurrentUser = require("../middlewares/attachCurrentUser");

router.post("/create", isAuthenticated, attachCurrentUser, async (req, res) => {
  try {
    const result = await AppointmentModel.create(req.body);

    await VetModel.findOneAndUpdate(
      { _id: req.body.vetId },
      { $push: { patients: req.body.animalId }}
    );

    return res.status(201).json(result);
  } catch (err) {
    console.error(err);

    return res.status(404).json({ msg: err });
  }
});

module.exports = router;
