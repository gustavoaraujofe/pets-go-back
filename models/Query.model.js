const mongoose = require('mongoose')

const querySchema = new mongoose.Schema({
    animalId: {type: mongoose.Types.ObjectId, ref: "Animal"},
    date: {type: String, default: new Date().toLocaleDateString()},
    weight: [],
    clinicalSigns: String,
    prescription: String,
    vetId: {type: mongoose.Types.ObjectId, ref: "Vet"}
});

module.exports = mongoose.model('Query', querySchema)