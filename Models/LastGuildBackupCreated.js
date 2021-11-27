const { Schema, model } = require("mongoose");

const lgbc = new Schema({
    guildName: {
        type: String
    },
    guildId: {
        type: String,
        required: true
    },
    backupId: {
        type: String
    }
});

module.exports = model("LGBC", lgbc);