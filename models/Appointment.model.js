const mongoose = require("mongoose");

const Appointment = new mongoose.Schema({
  animalId: { type: mongoose.Types.ObjectId, ref: "Animal" },
  date: String,
  hour: String,
  userId: { type: mongoose.Types.ObjectId, ref: "User" },
  vetId: { type: mongoose.Types.ObjectId, ref: "Vet" }
});

module.exports = mongoose.model("Appointment", Appointment)