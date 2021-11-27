const { Schema, model } = require("mongoose");

const BlacklistSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    pruebas: {
        type: String,
        required: true
    },
    razon: {
        type: String,
        required: true
    }
});

module.exports = model('Blacklist', BlacklistSchema);