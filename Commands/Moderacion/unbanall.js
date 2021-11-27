const { MessageEmbed, MessageActionRow, Message, MessageButton } = require("discord.js");
const emojis = require("../../emojis");
const Perms = require("../../Models/ModPerms");

module.exports = {
    name: "unbanall",
    aliases: ["uball"],
    description: "Desbanea a todos los baneados de este servidor",
    permissions: "ADMINISTRATOR",
    cooldown: 20,
    /**
     * @param {Message} message
     */
    async execute(message, args, commandName, client, Discord) {
        const userRoles = message.member.roles.cache;
        const findRolePerm = await Perms.find({ guildId: message.guild.id });
        let RolePerm;
        findRolePerm.some(d => {
            const role = userRoles.find(r => r.id === d.roleId);
            if(role) {
                RolePerm = role?.id
            }
        });
        const findPerms = await Perms.findOne({ guildId: message.guild.id, roleId: RolePerm });
        if(findPerms?.allowed.includes(commandName) && !findPerms?.denied.includes(commandName)) {
            if(!message.guild.me.permissions.has("ADMINISTRATOR")) {
                return message.reply({ content: `No puedo interactuar con este servidor sin los siguientes permisos: \`ADMINISTRADOR\``, allowedMentions: { repliedUser: false } });
            }
            await message.guild.bans.fetch().then(bans => {
                if(bans.size === 0) {
                    return message.reply({ content: `${emojis.negativo} | \`No existen baneos en este servidor\` `, allowedMentions: { repliedUser: false } });
                }
                const AwaitBans = new MessageEmbed()
                .setTitle("Información")
                .setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true }))
                .setDescription(`${emojis.cargando} | \`Desbaneando a ${bans.size} usuarios en este servidor\` `)
                .setColor("BLUE")
                message.reply({ embeds: [AwaitBans], allowedMentions: { repliedUser: false }  });
                bans.forEach(ban => {
                    message.guild.members.unban(ban.user.id, {
                        reason: `UnbanAll By ${message.author.tag}`
                    });
                });
                const ReadyBans = new MessageEmbed()
                .setTitle("Información")
                .setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true }))
                .setDescription(`${emojis.positivo} | \`Termine de desbanear usuarios correctamente\` `)
                .setColor("GREEN")
                message.channel.send({ embeds: [ReadyBans] });
            })
        } else if(message.member.permissions.has("ADMINISTRATOR")) {
            if(!message.guild.me.permissions.has("ADMINISTRATOR")) {
                return message.reply({ content: `No puedo interactuar con este servidor sin los siguientes permisos: \`ADMINISTRADOR\``, allowedMentions: { repliedUser: false } });
            }
            await message.guild.bans.fetch().then(bans => {
                if(bans.size === 0) {
                    return message.reply({ content: `${emojis.negativo} | \`No existen baneos en este servidor\` `, allowedMentions: { repliedUser: false } });
                }
                const AwaitBans = new MessageEmbed()
                .setTitle("Información")
                .setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true }))
                .setDescription(`${emojis.cargando} | \`Desbaneando a ${bans.size} usuarios en este servidor\` `)
                .setColor("BLUE")
                message.reply({ embeds: [AwaitBans], allowedMentions: { repliedUser: false }  });
                bans.forEach(ban => {
                    message.guild.members.unban(ban.user.id, {
                        reason: `UnbanAll By ${message.author.tag}`
                    });
                });
                const ReadyBans = new MessageEmbed()
                .setTitle("Información")
                .setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true }))
                .setDescription(`${emojis.positivo} | \`Termine de desbanear usuarios correctamente\` `)
                .setColor("GREEN")
                message.channel.send({ embeds: [ReadyBans] });
            })
        } else {
            return message.reply({ content: `${emojis.negativo} | \`No tienes permisos para ejecutar esta acción\` `, allowedMentions: { repliedUser: false } });
        }
    }
}