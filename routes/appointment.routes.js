const router = require("express").Router();

const UserModel = require("../models/User.model");
const VetModel = require("../models/Vet.model");
const AppointmentModel = require("../models/Appointment.model");

const isAuthenticated = require("../middlewares/isAuthenticated");
const attachCurrentUser = require("../middlewares/attachCurrentUser");

router.post("/create", isAuthenticated, attachCurrentUser, async (req, res) => {
  try {
    const result = await AppointmentModel.create(req.body);

    const vet = await VetModel.findOne({ _id: req.body.vetId });

    const animals = [...vet.patients, req.body.animalId];

    const animalsSet = [...new Set(animals)];

    vet.schedule.map((currentWeek) => {
      for (let key in currentWeek) {
        if (key === req.body.date) {
          const index = currentWeek[key].indexOf(req.body.hour);
          currentWeek[key].splice(index, 1);
          if (!currentWeek[key].length) {
            delete currentWeek[key];
          }
        }
      }
    });

    await VetModel.findOneAndUpdate(
      { _id: req.body.vetId },
      {
        $set: {
          patients: animalsSet,
          schedule: vet.schedule,
        },
      }
    );

    return res.status(201).json(result);
  } catch (err) {
    console.error(err);

    return res.status(404).json({ msg: err });
  }
});

router.get("/list", isAuthenticated, attachCurrentUser, async (req, res) => {
  try {
    const result = await AppointmentModel.find().populate("vetId").populate("userId").populate("animalId")

   
    result.map((currentAppointment) => {
      if (currentAppointment.date < new Date().toLocaleDateString()) {
        const index = result.indexOf(currentAppointment);
        result.splice(index, 1);
      }
    });

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
