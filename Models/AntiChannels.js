    const { Schema, model } = require("mongoose");

    const AntiChannelSchema = new Schema({
        guildId: {
            type: String,
            required: true
        },
        actived: {
            type: Boolean,
            default: true
        }
    });

    module.exports = model('AntiChannels', AntiChannelSchema);