const mongoose = require("mongoose");

const Appointment = new mongoose.Schema({
  animalId: String,
  date: String,
  hour: String,
  userId: String,
  vetId: { type: mongoose.Types.ObjectId, ref: "Vet" }
});

module.exports = mongoose.model("Appointment", Appointment)