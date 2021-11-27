const { Schema, model } = require("mongoose");

const PremiumSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    timestamp: {
        type: Number
    },
    ctimestamp: {
        type: Number
    }
});

module.exports = model('Premium', PremiumSchema);