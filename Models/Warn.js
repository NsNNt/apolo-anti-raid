const { Schema, model } = require("mongoose");

const warnSchema = new Schema({
    warnedId: {
        type: String,
        required: true
    },
    warnedTag: {
        type: String,
        required: true
    },
    modId: {
        type: String,
        required: true
    },
    modTag: {
        type: String,
        required: true  
    },
    razon: {
        type: String,
        required: true
    },
    guildId: {
        type: String,
        required: true
    },
    warnCreated: {
        type: String,
        required: true
    },
    warnId: {
        type: Number,
        required: true
    }
});

module.exports = model('Warn', warnSchema);