const mongoose = require("mongoose");

const VetSchema = new mongoose.Schema({
    name: { type: String, required: true, maxLength: 250, trim: true },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      match: /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/gm,
    },
    address: [{ type: String, required: true, trim: true}],
    avatarUrl: {type: String, default: "https://icsr.zju.edu.cn/faculty/default.png"},
    genre: {type: String},
    passwordHash: { type: String, required: true },
    role: {type: String, default: "vet"},
    crmv: {type: String, required: true},
    specialties: [{type: String, trim: true}],
    rating: [Number],
    schedule: {type: String},
    resetPassword: { type: String, default: ""}
  });
  
  
  module.exports = mongoose.model("Vet", VetSchema)