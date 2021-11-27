const { Schema, model } = require("mongoose");

const maliciousSchema = new Schema({
    guildId: {
        type: String,
        required: true
    },
    punishment: {
        type: String,
        default: "Marcar"
    },
    lastMaliciousDetected: {
        type: String,
        default: "Nadie."
    },
    actived: {
        type: Boolean,
        default: true
    }
});

module.exports = model('Malicious', maliciousSchema);