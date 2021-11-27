const { Schema, model } = require("mongoose");

const AntiRoleSchema = new Schema({
    guildId: {
        type: String,
        required: true
    },
    actived: {
        type: Boolean,
        default: true
    }
});

module.exports = model('AntiRoles', AntiRoleSchema);