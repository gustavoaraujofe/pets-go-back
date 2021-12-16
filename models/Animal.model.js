const { Schema, model } = require("mongoose");

const animalSchema = new Schema({
  name: { type: String, required: true, trim: true },
  age: { type: Number, required: true },
  breed: { type: String, required: true },
  weight: Number,
  gender: { type: String, required: true, trim: true },
  imageUrl: {
    type: String,
    default: "https://icsr.zju.edu.cn/faculty/default.png",
  },
  type: {type: String, required: true},
  medicalAppointmentHistory: [{ type: Schema.Types.ObjectId, ref: "MedicalAppointment" }],
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  vetId: [{ type: Schema.Types.ObjectId, ref: "Vet" }]
});


const AnimalModel = model("Animal", animalSchema);

module.exports = AnimalModel;