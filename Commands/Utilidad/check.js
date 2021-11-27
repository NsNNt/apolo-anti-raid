const { MessageEmbed, MessageActionRow, Message, MessageButton, MessageSelectMenu } = require("discord.js");
const emojis = require("../../emojis");

module.exports = {
    name: "check",
    aliases: ['myperms'],
    usage: "check",
    description: "Revisa mis permisos en este servidor",
    cooldown: 3,
    /**
     * 
     * @param {Message} message 
     * @param {string[]} args 
     */
    async execute(message, args, commandName, client, Discord, prefix) {
        if(!message.member.permissions.has("ADMINISTRATOR")) {
            return message.channel.send({ content: "No tienes __permisos de administrador__ para ejecutar esto." });
        }
        let haveAdmin = message.guild.me.permissions.has("ADMINISTRATOR");
        let haveBanMembers = message.guild.me.permissions.has("BAN_MEMBERS");
        let haveKickMembers = message.guild.me.permissions.has("KICK_MEMBERS");
        let rolePosition = message.guild.me.roles.highest.comparePositionTo(message.guild.roles.highest) >= 0;

        let msg = await message.channel.send({ content: `${emojis.cargando} | Comprobando mis permisos en \`${message.guild.name}\`...` });
        setTimeout(() => {
            message.channel.send({ content: `${haveAdmin ? `${emojis.positivo} \`Tengo el permiso de administrador en este servidor.\`` : `${emojis.negativo} \`No tengo el permiso de administrador en este servidor.\``}` })
        }, 1500);
        setTimeout(() => {
            message.channel.send({ content: `${haveBanMembers ? `${emojis.positivo} \`Tengo el permiso de banear miembros en este servidor.\`` : `${emojis.negativo} \`No tengo el permiso de banear miembros en este servidor.\`` }` })
        }, 2000);
        setTimeout(() => {
            message.channel.send({ content: `${haveKickMembers ? `${emojis.positivo} \`Tengo el permiso de expulsar miembros en este servidor.\`` : `${emojis.negativo} \`No tengo el permiso de expulsar miembros en este servidor.\``}` })
        }, 3000);
        setTimeout(async () => {
            let a = await message.channel.send({ content: `${emojis.cargando} | Comprobando si mi rol es el mas alto...` });
            a.edit({ content: `${rolePosition ? `${emojis.positivo} \`Tengo el rol mas alto en este servidor.\`` : `${emojis.negativo} \`No tengo el rol mas alto en este servidor.\``}` })
        }, 4000);
        setTimeout(() => {
            msg.edit({ content: `${emojis.positivo} | Termine de comprobar mis permisos sin ningun error.` })
        }, 5000)
    }
}