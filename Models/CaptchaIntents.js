const { Schema, model } = require("mongoose");

const captchaIntents = new Schema({
	userId: {
        type: String
    },
    guildId: {
        type: String
    },
    intents: {
        type: Number,
        default: 3
    }
});

module.exports = model('CaptchaIntents', captchaIntents);