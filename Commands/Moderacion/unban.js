const { MessageEmbed, MessageActionRow, Message, MessageButton } = require("discord.js");
const emojis = require("../../emojis");
const Perms = require("../../Models/ModPerms");
const moment = require("moment");

module.exports = {
    name: "unban",
    aliases: ["desbanear"],
    description: "Desbanea a un usuario de tu servidor",
    permissions: "BAN_MEMBERS",
    usage: "unban <Id>",
    cooldown: 5,
    /**
     * @param {Message} message
     */
    async execute(message, args, commandName, client, Discord, prefix) {
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
            if(!message.guild.me.permissions.has("BAN_MEMBERS")) {
                return message.reply({ content: `No puedo interactuar con este servidor sin los siguientes permisos: \`BAN_MEMBERS\``, allowedMentions: { repliedUser: false } });
            }
            const id = args[0]
            if(!id) {
                return message.reply({ content: `${emojis.negativo} | \`Proporciona una id para desbanear\` `, allowedMentions: { repliedUser: false } });
            }
            message.guild.bans.fetch().then(bans => {
                if(bans.size === 0) {
                    return message.channel.send({ content: "No existen baneos en este servidor." });
                } else {
                    const ban = bans.find(b => b.user.id === id);
                    if(!ban) {
                        return message.channel.send({ content: "Ese usuario no esta baneado de este servidor." });
                    } else {
                        message.guild.members.unban(ban.user.id, `Desbaneado por ${message.author.tag}`).then(() => {
                            message.channel.send({ content: `\`${ban.user.username}\` fue desbaneado correctamente` });
                        });
                    }
                }
            });
        } else if(message.member.permissions.has("BAN_MEMBERS")) {
            if(!message.guild.me.permissions.has("BAN_MEMBERS")) {
                return message.reply({ content: `No puedo interactuar con este servidor sin los siguientes permisos: \`BAN_MEMBERS\``, allowedMentions: { repliedUser: false } });
            }
            const id = args[0]
            if(!id) {
                return message.reply({ content: `${emojis.negativo} | \`Proporciona una id para desbanear\` `, allowedMentions: { repliedUser: false } });
            }
            message.guild.bans.fetch().then(bans => {
                if(bans.size === 0) {
                    return message.channel.send({ content: "No existen baneos en este servidor." });
                } else {
                    const ban = bans.find(b => b.user.id === id);
                    if(!ban) {
                        return message.channel.send({ content: "Ese usuario no esta baneado de este servidor." });
                    } else {
                        message.guild.members.unban(ban.user.id, `Desbaneado por ${message.author.tag}`).then(() => {
                            message.channel.send({ content: `\`${ban.user.username}\` fue desbaneado correctamente` });
                        });
                    }
                }
            });
        } else {
            return message.reply({ content: `${emojis.negativo} | \`No tienes permisos para ejecutar esta acción\` `, allowedMentions: { repliedUser: false } });
        }
    }
}