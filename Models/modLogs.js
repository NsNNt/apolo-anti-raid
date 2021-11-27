const { Schema, model } = require("mongoose");

const ModLogs = new Schema({
    guildId: {
        type: String
    },
    channelId: {
        type: String
    },
    actived: {
        type: Boolean,
        required: true
    }
});

module.exports = model('ModLogs', ModLogs);