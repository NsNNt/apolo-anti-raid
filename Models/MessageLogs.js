const { Schema, model } = require("mongoose");

const messageLogs = new Schema({
    channelId: {
        type: String,
        required: true
    },
    webhookId: {
        type: String,
        required: true
    },
    webhookToken: {
        type: String,
        required: true
    },
    guildId: {
        type: String,
        required: true
    }
});

module.exports = model('MessageLogs', messageLogs);