const { MessageEmbed, MessageActionRow, Message, MessageButton } = require("discord.js");
const Prefix = require("../../Models/Prefix");
const emojis = require("../../emojis");

module.exports = {
    name: "lock",
    aliases: ["cerrar"],
    description: "Cierra el canal en el que se utilice",
    permissions: "MANAGE_CHANNELS",
    cooldown: 15,
    /**
     * @param {Message} message
     */
    async execute(message, args, commandName, client, Discord) {
        if(!message.member.permissions.has("MANAGE_CHANNELS")) {
            return message.reply({ content: `${emojis.negativo} | \`No tienes permisos para ejecutar esta acción\` `, allowedMentions: { repliedUser: false } });
        }
        if(!message.guild.me.permissions.has("ADMINISTRATOR")) {
            return message.reply({ content: `No puedo interactuar con este servidor sin los siguientes permisos: \`ADMINISTRADOR\``, allowedMentions: { repliedUser: false } });
        }
        const Embed = new MessageEmbed()
        .setTitle("Información")
        .setDescription(`${emojis.cargando} | \`Bloqueando la escritura de este canal\``)
        .setColor("BLUE")
        let msg = await message.reply({ embeds: [Embed], allowedMentions: { repliedUser: false } });
        message.channel.permissionOverwrites.edit(message.guild.roles.everyone, {
            SEND_MESSAGES: false,
            ADD_REACTIONS: false
        });
        const Embed2 = new MessageEmbed()
        .setTitle(`Información`)
        .setDescription(`${emojis.positivo} | \`Bloquee este canal con exito\``)
        .setColor("GREEN")
        msg.edit({ embeds: [Embed2], allowedMentions: { repliedUser: false } })
    }
}