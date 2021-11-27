const { Schema, model } = require("mongoose");

const AutoModSchema = new Schema({
    guildId: {
        type: String,
        required: true
    },
    actived: {
        type: Boolean,
        default: false
    },
    maxWarnMute: {  
        type: Number,
        default: 3
    },
    maxWarnKick: {
        type: Number,
        default: 5
    },
    maxWarnBan: {
        type: Number,
        default: 6
    }
});

module.exports = model('AutoMod', AutoModSchema);