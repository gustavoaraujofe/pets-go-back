const mongoose = require("mongoose");

const MedicalAppointmentSchema = new mongoose.Schema({
  animalId: { type: mongoose.Types.ObjectId, ref: "Animal" },
  date: { type: String, default: new Date().toLocaleDateString()},
  weight: [Number],
  clinicalSign: [String],
  exam: [String],
  disease: [String],
  prescription: [String],
  vaccine: [String],
  vetId: { type: mongoose.Types.ObjectId, ref: "Vet" },
});

module.exports = mongoose.model("MedicalAppointment", MedicalAppointmentSchema);
