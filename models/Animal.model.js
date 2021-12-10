const mongoose = require('mongoose')

const animalSchema = new mongoose.Schema({
    name: {type: String, required: true, trim: true},
    age: {type: Number, required: true},
    breed: {type: String, required: true},
    weight: Number,
    sex: {type: String, required: true, trim: true},
    imageUrl: {type: String},
    medicalRecord: [{type: mongoose.Types.ObjectId, ref: "Prontuario"}],
    userId: {type: mongoose.Types.ObjectId, ref: "User"}
});

module.exports = mongoose.model('Animal', animalSchema)