const mongoose = require("mongoose");

const animalSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  age: { type: String, required: true },
  breed: { type: String, required: true },
  weight: String,
  gender: { type: String, required: true, trim: true },
  imageUrl: {
    type: String,
    default: "https://res.cloudinary.com/dkzcbs84l/image/upload/v1639707949/picture_vet/file_ebxbiz.png",
  },
  type: {type: String, required: true},
  medicalAppointmentHistory: [{ type: mongoose.Types.ObjectId, ref: "MedicalAppointment" }],
  userId: String,
  vetId: [{ type: mongoose.Types.ObjectId, ref: "Vet" }]
});

module.exports = mongoose.model("Animal", animalSchema);