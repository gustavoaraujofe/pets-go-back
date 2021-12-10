const mongoose = require("mongoose");

const MedicalRecordSchema = new mongoose.Schema({
  queriesHistory: [{ type: mongoose.Types.ObjectId, ref: "Query" }],
  examHistory: [String],
  diseaseHistory: [String],
  vaccines: [String],
  idAnimal: {
    type: mongoose.Types.ObjectId,
    ref: "Animal",
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model("MedicalRecord", MedicalRecordSchema);
