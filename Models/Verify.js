const { Schema, model } = require("mongoose");

const verify = new Schema({
    guildId: { 
        type: String,
        required: true
    },
    channelId: {
        type: String
    }
});

module.exports = model('Verify', verify);