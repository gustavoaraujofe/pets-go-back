const mongoose = require("mongoose");

const MedicalRecordSchema = new mongoose.Schema({
  idAnimal: {
    type: mongoose.Types.ObjectId,
    ref: "Animal"
  },
  appointmentHistory: [{ type: mongoose.Types.ObjectId, ref: "MedicalAppointment" }],
  date: { type: String, default: new Date().toLocaleDateString() },
  clinicalSign: String,
  exam: String,
  disease: String,
  prescription: String,
  vaccine: String,
  authorId: { type: mongoose.Types.ObjectId, ref: "Vet" }
});

module.exports = mongoose.model("MedicalRecord", MedicalRecordSchema);