const mongoose = require('mongoose');

const postoSchema = new mongoose.Schema({
    id_posto: Number,
    id_dono: Number,
    nome_dono: String,
    num_dono: String,
    pago: Boolean
});

module.exports = mongoose.model('posto', postoSchema)