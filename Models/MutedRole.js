const { Schema, model } = require("mongoose");

const mutedRoleSchema = new Schema({
    roleId: {
        type: String,
        required: true
    },
    guildId: {
        type: String,
        required: true
    }
});

module.exports = model('MutedRole', mutedRoleSchema);