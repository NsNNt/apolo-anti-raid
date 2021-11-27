const { Schema, model } = require("mongoose");

const apelacionSchema = new Schema({
    userId: {
        type: String,
        required: true
    }
});

module.exports = model('Apelacion', apelacionSchema)