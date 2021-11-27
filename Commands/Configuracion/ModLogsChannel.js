const { MessageEmbed, MessageActionRow, Message, MessageButton } = require("discord.js");
const ModLogs = require("../../Models/modLogs");
const emojis = require("../../emojis");

module.exports = {
    name: "mod-logs-channel",
    aliases: ["mod-log-channel"],
    description: "Coloca el canal donde se enviaran los logs de moderación",
    permissions: "MANAGE_GUILD",
    usage: "mod-logs",
    cooldown: 5,
    /**
     * @param {Message} message
     */
    async execute(message, args, commandName, client, Discord, prefix) {
        if(!message.member.permissions.has("MANAGE_GUILD")) {
            return message.channel.send({ content: "No tienes permisos para ejecutar esto!" })
        } else {
            if(!message.guild.me.permissions.has("MANAGE_GUILD")) {
                return message.channel.send({ content: "No tengo permisos de `MANEJAR_SERVIDOR` para ejecutar esto." });
            }
            const modLogs = await ModLogs.findOne({ guildId: message.guild.id });
            if(!modLogs || !modLogs?.actived) {
                return message.channel.send({ content: "Los logs de moderación estan __desactivados__ usa `"+prefix+"mod-logs`" });
            }
            const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
            if(!channel) {
                return message.channel.send({ content: "No mencionaste ni proporcionaste un canal!" });
            }
            if(!message.guild.me.permissionsIn(channel).has("SEND_MESSAGES")) {
                return message.channel.send({ content: "No tengo permisos de enviar mensajes en ese canal!" });
            }
            modLogs.channelId = channel.id;
            await modLogs.save();
            message.channel.send({ content: `Ok, enviare los logs de moderación a el canal <#${channel.id}>` });
        }
    }
}