const { MessageEmbed, MessageActionRow, Message, MessageButton } = require("discord.js");
const emojis = require("../../emojis");

module.exports = {
    name: "autoconfig",
    aliases: ["auto-config"],
    description: "Configura el servidor automaticamente con la mejor protección",
    cooldown: 5,
    permissions: "ADMINISTRATOR",
    /**
     * @param {Message} message
     */
    async execute(message, args, commandName, client, Discord) {
        if(!message.member.permissions.has("ADMINISTRATOR")) {
            return message.reply({ content: `${emojis.negativo} | \`No tienes permisos para ejecutar este comando\``, allowedMentions: { repliedUser: false } });
        } else {
            if(!message.guild.me.permissions.has("ADMINISTRATOR")) {
                return message.reply({ content: `No puedo interactuar con este servidor sin los siguientes permisos: \`ADMINISTRADOR\``, allowedMentions: { repliedUser: false } });
            }
            return message.reply({ content: `${emojis.mail} | \`Este comando estara disponible en la version 2.4.0\``, allowedMentions: { repliedUser: false } });
        }
    }
}