const { Schema, model } = require("mongoose");

const modRoleSchema = new Schema({
    roleId: {
        type: String,
        required: true
    },
    guildId: {
        type: String,
        required: true
    }
});

module.exports = model('ModRole', modRoleSchema);