const { Schema, model } = require("mongoose");

const PremiumSchema = new Schema({
    code: {
        type: String,
        required: true
    },
    time: {
        type: Number,
        required: true
    },
    timestamp: {
        type: Number
    },
    redemmed: {
        type: Boolean,
        required: true
    }
});

module.exports = model('PremiumCode', PremiumSchema);