const { Schema, model } = require("mongoose");

const guildSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    id: {
        type: String,
        unique: true,
        required: true
    }
});

module.exports = model('guild', guildSchema);