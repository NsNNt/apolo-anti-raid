const { Schema, model } = require("mongoose");

const AntiTokensSchema = new Schema({
    guildId: {
        type: String,
        required: true
    },
    actived: {
        type: Boolean,
        default: true
    }
});

module.exports = model('AntiTokens', AntiTokensSchema);