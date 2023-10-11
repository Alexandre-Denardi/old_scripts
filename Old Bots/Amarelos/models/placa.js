const mongoose = require('mongoose');

const metaSchema = new mongoose.Schema({
    placa: String,
});

module.exports = mongoose.model('placa', metaSchema)