const { Client } = require("discord.js");

module.exports = {
    name: "ready",
    /**
     * @param {Client} client
     *  
     */
    async execute(client) {
        client.user.setActivity('🪐 las estrellas', {
            type: "WATCHING"
        })
        console.log("El cliente esta on 💚")
    }
}