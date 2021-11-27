const { Schema, model } = require("mongoose");

const AntiLinkSchema = new Schema({
    guildId: {
        type: String,
        required: true
    },
    actived: {
        type: Boolean,
        default: true
    }
});

module.exports = model('AntiLinks', AntiLinkSchema);