const { Schema, model } = require("mongoose");

const gbc = new Schema({
    guildName: {
        type: String
    },
    guildId: {
        type: String
    },
    backupId: {
        type: String
    },
    authorId: {
        type: String
    }
});

module.exports = model("GBC", gbc);