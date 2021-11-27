const { Schema, model } = require("mongoose");

const prefixSchema = new Schema({
    prefix: {
        type: String,
        required: true
    },
    guildId: {
        type: String,
        required: true
    }
});

module.exports = model('Prefix', prefixSchema);