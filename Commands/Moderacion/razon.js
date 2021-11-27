const { MessageEmbed, MessageActionRow, Message, MessageButton, Client } = require("discord.js");
const emojis = require("../../emojis");
const Perms = require("../../Models/ModPerms");
const Warn = require("../../Models/Warn");
const ModLogs = require("../../Models/modLogs");
const moment = require("moment");

module.exports = {
    name: "razon",
    aliases: ["reason"],
    description: "Cambia la razón de un warn",
    usage: "razon <RazonId> <Razón>",
    permissions: "KICK_MEMBERS",
    cooldown: 5,
    /**
     * 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {Client} client 
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
            if(!message.guild.me.permissions.has("KICK_MEMBERS")) {
                return message.reply({ content: `No puedo interactuar con este comando sin los siguientes permisos: \`KICK_MEMBERS\``, allowedMentions: { repliedUser: false } });
            }
            const id = args[0];
            const razon = args.slice(1).join(" ");
            if(!id) {
                return message.channel.send({ content: "Por favor proporciona la id del warn." });
            }
            const warn = await Warn.findOne({ warnId: id, guildId: message.guild.id });
            if(!warn) {
                return message.channel.send({ content: "Ese warn __no existe__." })
            }
            if(!razon) {
                return message.channel.send({ content: "Por favor coloca la nueva razón del warn." });
            }
            warn.razon = razon;
            await warn.save();
            message.channel.send({ content: `Razón del warn \`${id}\` actualizada!` });
        } else if(message.member.permissions.has("KICK_MEMBERS")) {
            if(!message.guild.me.permissions.has("KICK_MEMBERS")) {
                return message.reply({ content: `No puedo interactuar con este comando sin los siguientes permisos: \`KICK_MEMBERS\``, allowedMentions: { repliedUser: false } });
            }
            const id = args[0];
            const razon = args.slice(1).join(" ");
            if(!id) {
                return message.channel.send({ content: "Por favor proporciona la id del warn." });
            }
            const warn = await Warn.findOne({ warnId: id, guildId: message.guild.id });
            if(!warn) {
                return message.channel.send({ content: "Ese warn __no existe__." })
            }
            if(!razon) {
                return message.channel.send({ content: "Por favor coloca la nueva razón del warn." });
            }
            warn.razon = razon;
            await warn.save();
            message.channel.send({ content: `Razón del warn \`${id}\` actualizada!` });
        } else {
            return message.reply({ content: `${emojis.negativo} | \`No tienes permisos para ejecutar esta acción\` `, allowedMentions: { repliedUser: false } });
        }
    }
}