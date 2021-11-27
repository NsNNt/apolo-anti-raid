const { MessageEmbed, MessageActionRow, Message, MessageButton } = require("discord.js");
const Premium = require("../../Models/UserPremium");
const ms = require("ms");

module.exports = {
    name: "messageCreate",
    /**
     * @param {Message} message
     */
    async execute(message, client) {
        const user = await Premium.findOne({ userId: message.author.id });
        if(!user) {
            return;
        } else {
            if((Date.now() + user?.ctimestamp) < 2592000000) {
                await Premium.findOneAndDelete({ userId: message.author.id });
                return message.channel.send({ content: `${message.author} vaya! Parece que tu premium ha expirado...` });
            } else if((Date.now() + user?.ctimestamp) < 31557600000) {
                await Premium.findOneAndDelete({ userId: message.author.id });
                return message.channel.send({ content: `${message.author} vaya! Parece que tu premium ha expirado...` });
            } else {
                return;
            }
        }
    }
}