const { Schema, model } = require("mongoose");

const AntiBotSchema = new Schema({
    guildId: {
        type: String,
        required: true
    },
    actived: {
        type: Boolean,
        default: true
    }
});

module.exports = model('AntiBots', AntiBotSchema);