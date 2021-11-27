const { MessageEmbed, MessageActionRow, Message, MessageButton } = require("discord.js");
const emojis = require("../../emojis");
const moment = require("moment");
const Perms = require("../../Models/ModPerms");

module.exports = {
    name: "ban",
    aliases: ["banear", "b"],
    description: "Banea a un usuario de tu servidor",
    usage: "ban @Usuario <Razón>",
    permissions: "BAN_MEMBERS",
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
                return message.channel.send({ content: `No puedo interactuar con este servidor sin los siguientes permisos: \`BAN_MEMBERS\``, allowedMentions: { repliedUser: false } });
            }
            const Target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
            const Razon = args.slice(1).join(" ");
            if(!Target?.user) {
                return message.channel.send({ content: "Ese usuario no existe." });
            }
            if(Target.user.id === message.author.id) {
                return message.channel.send({ content: "No puedes banearte a ti mismo." })
            }
            if(Target.user.id === client.user.id) {
                return message.channel.send({ content: "Qué??, ¿Por qué?" });
            }
            if(!Razon) {
                return message.channel.send({ content: "Debes colocar una razón del baneo." })
            }
            if(Razon.length > 256) {
                return message.channel.send({ content: "La razón debe ser menor a 256 caracteres." });
            }
            if(message.member.roles.highest.comparePositionTo(Target.roles.highest) <= 0) {
                return message.channel.send({ content: "Este usuario tiene más o los mismos roles que tú." });
            }
            if(message.guild.me.roles.highest.comparePositionTo(Target.roles.highest) <= 0) {
                return message.channel.send({ content: "Este usuario tiene más o los mismos roles que yo", allowedMentions: { repliedUser: false } });
            }
            message.guild.members.ban(Target, {
                reason: `${Razon} - ${message.author.tag}`
            }).catch(e => {});
            const Response = new MessageEmbed()
            .setTimestamp()
            .setColor("BLUE")
            .setDescription(`__\`${Target.user.tag}\` | ${Target.user.id} baneado__\n\nModerador: \`${message.author.tag}\` | ${message.author.id}\nRazón: \`${Razon} | Día: ${moment().format("Do/MMMM/YYYY").replace("º", "")}\``)
            /* PARA EL USUARIO */
            const Response2 = new MessageEmbed()
            .setTimestamp()
            .setColor("BLUE")
            .setDescription(`__\`${Target.user.tag}\` | ${Target.user.id} fuiste baneado__\n\nModerador: \`${message.author.tag}\` | ${message.author.id}\nRazón: \`${Razon} | Día: ${moment().format("Do/MMMM/YYYY").replace("º", "")}\``)
            message.channel.send({ embeds: [Response], allowedMentions: { repliedUser: false } });
            Target.send({ embeds: [Response2] }).catch(e => {});
        } else if(message.member.permissions.has("BAN_MEMBERS")) {
            if(!message.guild.me.permissions.has("BAN_MEMBERS")) {
                return message.channel.send({ content: `No puedo interactuar con este servidor sin los siguientes permisos: \`BAN_MEMBERS\``, allowedMentions: { repliedUser: false } });
            }
            const Target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
            const Razon = args.slice(1).join(" ");
            if(!Target?.user) {
                return message.channel.send({ content: "Ese usuario no existe." });
            }
            if(Target.user.id === message.author.id) {
                return message.channel.send({ content: "No puedes banearte a ti mismo." })
            }
            if(Target.user.id === client.user.id) {
                return message.channel.send({ content: "Qué??, ¿Por qué?" });
            }
            if(!Razon) {
                return message.channel.send({ content: "Debes colocar una razón del baneo." })
            }
            if(Razon.length > 256) {
                return message.channel.send({ content: "La razón debe ser menor a 256 caracteres." });
            }
            if(message.member.roles.highest.comparePositionTo(Target.roles.highest) <= 0) {
                return message.channel.send({ content: "Este usuario tiene más o los mismos roles que tú." });
            }
            if(message.guild.me.roles.highest.comparePositionTo(Target.roles.highest) <= 0) {
                return message.channel.send({ content: "Este usuario tiene más o los mismos roles que yo", allowedMentions: { repliedUser: false } });
            }
            message.guild.members.ban(Target, {
                reason: `${Razon} - ${message.author.tag}`
            }).catch(e => {});
            const Response = new MessageEmbed()
            .setTimestamp()
            .setColor("BLUE")
            .setDescription(`__\`${Target.user.tag}\` | ${Target.user.id} baneado__\n\nModerador: \`${message.author.tag}\` | ${message.author.id}\nRazón: \`${Razon} | Día: ${moment().format("Do/MMMM/YYYY").replace("º", "")}\``)
            /* PARA EL USUARIO */
            const Response2 = new MessageEmbed()
            .setTimestamp()
            .setColor("BLUE")
            .setDescription(`__\`${Target.user.tag}\` | ${Target.user.id} fuiste baneado__\n\nModerador: \`${message.author.tag}\` | ${message.author.id}\nRazón: \`${Razon} | Día: ${moment().format("Do/MMMM/YYYY").replace("º", "")}\``)
            message.channel.send({ embeds: [Response], allowedMentions: { repliedUser: false } });
            Target.send({ embeds: [Response2] }).catch(e => {});
        } else {
            return message.reply({ content: `${emojis.negativo} | \`No tienes permisos para ejecutar esta acción\` `, allowedMentions: { repliedUser: false } });
        }
    }
}