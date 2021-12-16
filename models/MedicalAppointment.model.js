const mongoose = require("mongoose");

const MedicalAppointmentSchema = new mongoose.Schema({
  date: { type: String, default: new Date().toLocaleDateString() },
  weight: Number,
  clinicalSign: String,
  exam: String,
  disease: String,
  prescription: String,
  vaccine: String,
  vetId: { type: mongoose.Types.ObjectId, ref: "Vet" },
  animalId: { type: mongoose.Types.ObjectId, ref: "Animal" },
});

module.exports = mongoose.model("MedicalAppointment", MedicalAppointmentSchema);
