const { Schema, model } = require("mongoose");

const verifyRole = new Schema({
    guildId: { 
        type: String,
        required: true
    },
    roleId: {
        type: String
    }
});

module.exports = model('verifyRole', verifyRole);