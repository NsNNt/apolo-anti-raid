const { MessageEmbed, MessageActionRow, Message, MessageButton } = require("discord.js");
const emojis = require("../../emojis");
const Perms = require("../../Models/ModPerms");

module.exports = {
    name: "forceban",
    aliases: ["forzar-baneos"],
    description: "Banea a los maliciosos que decidas en tu servidor",
    permissions: "ADMINISTRATOR",
    cooldown: 5,
    /**
     * @param {Message} message
     */
    async execute(message, args, commandName, client, Discord, prefix) {
        if(!message.member.permissions.has("ADMINISTRATOR")) {
            return message.reply({ content: `${emojis.negativo} | \`No tienes permisos para ejecutar esta acción\` `, allowedMentions: { repliedUser: false } });
        } else {
            if(!message.guild.me.permissions.has("ADMINISTRATOR")) {
                return message.reply({ content: `No puedo interactuar con este servidor sin los siguientes permisos: \`ADMINISTRADOR\``, allowedMentions: { repliedUser: false } });
            }
            return message.reply({ content: `${emojis.mail} | \`Nuestro sistema actualmente se encuentra en proceso de crecimiento, reporta a un usuario con ${prefix}reportar\` `, allowedMentions: { repliedUser: false } });
        }
    }
}