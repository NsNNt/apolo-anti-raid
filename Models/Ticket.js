const { Schema, model } = require("mongoose");

const ticketSchema = new Schema({
    userId: {
        type: String
    },
    ticketId: {
        type: String
    },
    channelId: {
        type: String
    },
    messages: {
        type: Array
    }
});

module.exports = model('Ticket', ticketSchema);