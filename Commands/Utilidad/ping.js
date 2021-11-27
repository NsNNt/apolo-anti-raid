const { MessageEmbed, MessageActionRow, Message, MessageButton } = require("discord.js");
const emojis = require("../../emojis");

module.exports = {
    name: "ping",
    aliases: ["lag"],
    description: "Latencia del bot",
    cooldown: 5,
    /**
     * @param {Message} message
     */
    async execute(message, args, commandName, client, Discord) {
        
        message.reply({ content: `🌐 BOT: ${client.ws.ping}ms\n📍 Discord Api: ${Date.now() - message.createdTimestamp}ms`, allowedMentions: { repliedUser: false } });
    }
}