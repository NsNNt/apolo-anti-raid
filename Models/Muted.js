const { Schema, model } = require("mongoose");

const mutedSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    guildId: {
        type: String,
        required: true
    }
});

module.exports = model('Muted', mutedSchema);