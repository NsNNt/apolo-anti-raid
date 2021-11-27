const { Schema, model } = require("mongoose");

const permsSchema = new Schema({
    guildId: {
        type: String,
        required: true
    },
    roleId: {
        type: String,
        required: true
    },
    allowed: {
        type: Array
    },
    denied: {
        type: Array
    }
});

module.exports = model('Perms', permsSchema);
