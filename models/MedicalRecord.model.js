const mongoose = require("mongoose");

const MedicalRecordSchema = new mongoose.Schema({
    queriesHistory: [String],
    examHistory: [String],
    diseaseHistory: [String],
    vaccines: [String],
    idAnimal: {type: String, required: true, unique: true}
  });
  
  
  module.exports = mongoose.model("MedicalRecord", MedicalRecordSchema)