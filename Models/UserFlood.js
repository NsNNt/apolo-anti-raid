const { Schema, model } = require("mongoose");

const UserFloodSchema = new Schema({
    guildId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    repeated: {
        type: Number
    },
    warned: {
        type: Number
    }
});

module.exports = model('UserFlood', UserFloodSchema);