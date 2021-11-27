const { MessageEmbed, MessageActionRow, Message, MessageButton } = require("discord.js");
const emojis = require("../../emojis");
const Perms = require("../../Models/ModPerms");
const moment = require("moment");

module.exports = {
    name: "hackban",
    aliases: ["hackbanear"],
    description: "Banea a un usuario que no esta en tu servidor",
    usage: "hackban <Id> <Razón>",
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
                return message.reply({ content: `No puedo interactuar con este servidor sin los siguientes permisos: \`BAN_MEMBERS\``, allowedMentions: { repliedUser: false } });
            }
            const Target = args[0];
            const Razon = args.slice(1).join(" ");
            if(!Target) {
                return message.reply({ content: `${emojis.negativo} | \`Proporciona una id\``, allowedMentions: { repliedUser: false } });
            }
            if(Target === message.author.id) {
                return message.reply({ content: `${emojis.negativo} | \`No puedes banearte a ti mismo\``, allowedMentions: { repliedUser: false } });
            }
            if(Target === client.user.id) {
                return message.reply({ content: `${emojis.negativo} | \`No puedes banearme a mi...\``, allowedMentions: { repliedUser: false } }); 
            }
            if(!Razon) {
                return message.reply({ content: `${emojis.negativo} | \`Proporciona una razón del baneo\``, allowedMentions: { repliedUser: false } });
            }
            if(Razon.length > 256) {
                return message.reply({ content: `${emojis.negativo} | \`La razón no puede ser mayor a 256 caracteres\` `, allowedMentions: { repliedUser: false } });
            }
            message.guild.members.ban(Target, {
                reason: `${Razon} - ${message.author.tag}`
            }).catch(e => {});
            client.users.fetch(Target).then(user => {
                message.channel.send({ content: `\`${user.username}\` fue baneado de este servidor.` });
            }).catch(e => {
                message.channel.send({ content: "Error: `Ese usuario no existe`" })
            });
        } else if(message.member.permissions.has("BAN_MEMBERS")) {
            if(!message.guild.me.permissions.has("BAN_MEMBERS")) {
                return message.reply({ content: `No puedo interactuar con este servidor sin los siguientes permisos: \`BAN_MEMBERS\``, allowedMentions: { repliedUser: false } });
            }
            const Target = args[0];
            const Razon = args.slice(1).join(" ");
            if(!Target) {
                return message.reply({ content: `${emojis.negativo} | \`Proporciona una id\``, allowedMentions: { repliedUser: false } });
            }
            if(Target === message.author.id) {
                return message.reply({ content: `${emojis.negativo} | \`No puedes banearte a ti mismo\``, allowedMentions: { repliedUser: false } });
            }
            if(Target === client.user.id) {
                return message.reply({ content: `${emojis.negativo} | \`No puedes banearme a mi...\``, allowedMentions: { repliedUser: false } }); 
            }
            if(!Razon) {
                return message.reply({ content: `${emojis.negativo} | \`Proporciona una razón del baneo\``, allowedMentions: { repliedUser: false } });
            }
            if(Razon.length > 256) {
                return message.reply({ content: `${emojis.negativo} | \`La razón no puede ser mayor a 256 caracteres\` `, allowedMentions: { repliedUser: false } });
            }
            message.guild.members.ban(Target, {
                reason: `${Razon} - ${message.author.tag}`
            }).catch(e => {});
            client.users.fetch(Target).then(user => {
                message.channel.send({ content: `\`${user.username}\` fue baneado de este servidor.` });
            }).catch(e => {
                message.channel.send({ content: "Error: `Ese usuario no existe`" })
            });
        } else {
            return message.reply({ content: `${emojis.negativo} | \`No tienes permisos para ejecutar esta acción\` `, allowedMentions: { repliedUser: false } });
        }
    }
}