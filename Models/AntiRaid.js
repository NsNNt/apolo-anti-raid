const { Schema, model } = require("mongoose");

const AntiRaidSchema = new Schema({
    guildId: {
        type: String,
        required: true
    },
    actived: {
        type: Boolean,
        default: true
    },
    maxChannelsCreate: {
        type: Number,
        default: 3
    },
    maxRolesCreate: {
        type: Number,
        default: 3
    },
    maxChannelsDelete: {
        type: Number,
        default: 2
    },
    maxRolesDelete: {
        type: Number,
        default: 2
    },
    maxBansNumber: {
        type: Number,
        default: 3
    },
    maxKickNumber: {
        type: Number,
        default: 3
    },
    maxWebhookMessages: {
        type: Number,
        default: 3
    },
    sancionType: {
        type: String,
        default: "ban"
    }
});

module.exports = model('AntiRaid', AntiRaidSchema);