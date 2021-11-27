const { Schema, model } = require("mongoose");

const userRaidSchema = new Schema({
    guildId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    ChannelsCreate: {
        type: Number
    },
    RolesCreate: {
        type: Number
    },
    ChannelsDelete: {
        type: Number
    },
    RolesDelete: {
        type: Number
    },
    BansNumber: {
        type: Number
    },
    KickNumber: {
        type: Number
    },
    guildNameUpdate: {
        type: Number
    }
});

module.exports = model('userRaidLogs', userRaidSchema);