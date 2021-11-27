const { Client, Message, MessageEmbed, Collection } = require("discord.js");
const AntiPalabras = require("../../Models/AntiPalabras");
const emojis = require("../../emojis");
const moment = require("moment");

module.exports = {
    name: "messageCreate",
    /**
     * @param {Client} client
     * @param {Message} message
     */
    async execute(message, client, Discord) {
        if(!message.guild) return;
        if(!message.guild.me.permissions.has("MANAGE_MESSAGES")) {
            return;
        }
        const haveAntiPalabras = await AntiPalabras.findOne({ guildId: message.guild.id });
        if(!haveAntiPalabras) {
            return;
        }
        if(haveAntiPalabras?.actived) {
            const palabrasblacklist = haveAntiPalabras.palabras;
            if(message.member?.permissions.has("ADMINISTRATOR")) {
                return;
            }
            if(palabrasblacklist.some(w => message.content.toLowerCase().includes(w))) {
                message.delete();
                message.channel.send({ content: `${message.author}, Esa palabra no esta permitida` }).then(msg => {
                    setTimeout(() => {
                        msg.delete().catch(e => {});
                    }, 3000);
                });
            }
        } else {
            return;
        }
    }
}