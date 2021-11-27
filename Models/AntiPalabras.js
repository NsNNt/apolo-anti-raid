const { Schema, model } = require("mongoose");

const AntiPalabraschema = new Schema({
    guildId: {
        type: String,
        required: true
    },
    actived: {
        type: Boolean,
        default: false
    },
    palabras: {
        type: Array
    }
});

module.exports = model('AntiPalabras', AntiPalabraschema);