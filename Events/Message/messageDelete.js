const { Client, Message, MessageEmbed, Collection, WebhookClient } = require("discord.js");
const MessageLogs = require("../../Models/MessageLogs");
const emojis = require("../../emojis");
const moment = require("moment");

module.exports = {
    name: "messageDelete",
    /**
     * @param {Client} client
     * @param {Message} message
     */
    async execute(message, client, Discord) {
        const guildHasLogs = await MessageLogs.findOne({ guildId: message.guild.id });
        if(guildHasLogs) {
            const { webhookToken, webhookId } = guildHasLogs;
            const webhookClient = new WebhookClient({
                token: webhookToken,
                id: webhookId
            });
            if(!webhookClient) {
                return;
            }
            const Response = new MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setDescription(`Message deleted in <#${message.channel?.id}>\n\n**Content:** \n${message.content ? message.content : "None"}\n\n**Date:** \n\`${moment()}\`\n\n**ID:**\n\`\`\`markdown\n# User = ${message.author?.id}\n# Message = ${message?.id}\n\`\`\``)
            .setFooter("Apolo#1922",  client.user.avatarURL({ dynamic: true }))
            .setTimestamp()
            .setColor("RANDOM")
            webhookClient.send({
                embeds: [Response],
                avatarURL: client.user.avatarURL({ dynamic: true })
            }).catch(e => { console.log(e) });
        }
    }
}