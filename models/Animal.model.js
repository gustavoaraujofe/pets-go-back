const mongoose = require("mongoose");

const animalSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  age: { type: Number, required: true },
  breed: { type: String, required: true },
  weight: Number,
  gender: { type: String, required: true, trim: true },
  imageUrl: {
    type: String,
    default: "https://icsr.zju.edu.cn/faculty/default.png",
  },
  medicalRecord: [{ type: mongoose.Types.ObjectId, ref: "MedicalRecord" }],
  userId: { type: mongoose.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Animal", animalSchema);
