const { Client } = require("discord.js");

module.exports = {
    name: "error",
    /**
     * @param {Client} client
     *  
     */
    async execute(error, client) {
        console.log(`[CLIENT ERRORS] - ${error.message}`)
    }
}