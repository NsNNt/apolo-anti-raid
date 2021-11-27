const { Schema, model } = require("mongoose");

const whitelist = new Schema({
    guildId: {
        type     : String,
        required : true
    },
    userId: {
        type     : String,
        required : true
    }
});

module.exports = model('Whitelist', whitelist);