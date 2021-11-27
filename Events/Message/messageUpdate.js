const { Client, Message, MessageEmbed, Collection, WebhookClient } = require("discord.js");
const MessageLogs = require("../../Models/MessageLogs");
const emojis = require("../../emojis");
const moment = require("moment");

module.exports = {
    name: "messageUpdate",
    /**
     * @param {Client} client
     * @param {Message} oldMessage,
     * @param {Message} newMessage
     */
    async execute(oldMessage, newMessage, client, Discord) {
        const guildHasLogs = await MessageLogs.findOne({ guildId: oldMessage.guild.id });
        if(guildHasLogs) {
            const { webhookToken, webhookId } = guildHasLogs;
            const webhookClient = new WebhookClient({
                token: webhookToken,
                id: webhookId
            });
            if(!webhookClient) {
                return;
            }
            const original = oldMessage.content.slice(0, 1950) + (oldMessage.content.length > 1950 ? "..." : "");
            const edited = newMessage.content.slice(0, 1950) + (newMessage.content.length > 1950 ? "..." : "");
            webhookClient.send({
                embeds: [{
                    title: "Mensaje Editado",
                    description: `${oldMessage.author} edito un mensaje en ${oldMessage.channel}`,
                    fields: [
                        {
                            name: "Antes",
                            value: `${original}`,
                            inline: true
                        },
                        {
                            name: "Despues",
                            value: `${edited}`,
                            inline: true
                        },
                        {
                            name: "¿Es un bot?",
                            value: `${oldMessage.author.bot ? "Si, es un bot." : "No, no es un bot."}`
                        }
                    ],
                    footer: {
                        text: "Apolo#1922", 
                        icon_url:  client.user.avatarURL({ dynamic: true })
                    },
                    color: "ORANGE"
                }],
                avatarURL: client.user.avatarURL({ dynamic: true })
            }).catch(e => {});
        }
    }
}