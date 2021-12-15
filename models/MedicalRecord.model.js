const mongoose = require("mongoose");

const MedicalRecordSchema = new mongoose.Schema({
  idAnimal: {
    type: mongoose.Types.ObjectId,
    ref: "Animal"
  },
  appointmentHistory: [{ type: mongoose.Types.ObjectId, ref: "MedicalAppointment" }],
  date: { type: String, default: new Date().toLocaleDateString() },
  authorId: { type: mongoose.Types.ObjectId, ref: "Vet" }
});

module.exports = mongoose.model("MedicalRecord", MedicalRecordSchema);