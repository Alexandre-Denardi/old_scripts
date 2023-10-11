const mongoose = require('mongoose');

const advSchema = new mongoose.Schema({
    UserId: String,
    Nadv: Number,
    Adv: [String],
});

module.exports = mongoose.model('adv', advSchema)