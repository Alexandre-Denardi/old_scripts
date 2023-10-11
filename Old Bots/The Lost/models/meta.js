const mongoose = require('mongoose');

const metaSchema = new mongoose.Schema({
    id: String,
    dinhieiroS: String,
    createdAt: {
        type: Date,
        default: () => Date.now(),
    },
});

module.exports = mongoose.model('meta', metaSchema)