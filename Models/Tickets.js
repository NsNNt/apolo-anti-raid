const { Schema, model } = require("mongoose");

const ticketsSchema = new Schema({
    tickets: {
        type: String
    }
});

module.exports = model('TicketsCount', ticketsSchema);