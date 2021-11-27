const { Schema, model } = require("mongoose");

const AntiFloodSchema = new Schema({
    guildId: {
        type: String,
        required: true
    },
    actived: {
        type: Boolean,
        default: true
    },
    times: {
        type: Number,
        default: 5
    },
    sancion: {
        type: String,
        default: "mute"
    },
    time: {
        type: Number,
        default: 9000 
    }
});

module.exports = model('AntiFloods', AntiFloodSchema);