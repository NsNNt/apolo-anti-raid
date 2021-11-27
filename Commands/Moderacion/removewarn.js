const { MessageEmbed, MessageActionRow, Message, MessageButton, Client } = require("discord.js");
const emojis = require("../../emojis");
const Perms = require("../../Models/ModPerms");
const Warn = require("../../Models/Warn");

module.exports = {
    name: "remove-warn",
    aliases: ["removewarn", "warnremove", "warn-remove"],
    description: "Remueve una advertencia de un usuario",
    usage: "removewarn @Usuario <warnId/all>",
    permissions: "KICK_MEMBERS",
    cooldown: 5,
    /** 
     * @param {Message} message
     * @param {Client} client
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
            if(!message.guild.me.permissions.has("KICK_MEMBERS")) {
                return message.reply({ content: `No puedo interactuar con este comando sin los siguientes permisos: \`KICK_MEMBERS\``, allowedMentions: { repliedUser: false } });
            }
            const User = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
            const id = args[1];
            if(!User) {
                return message.reply({ content: `${emojis.negativo} | \`No se encuentra a ese usuario\` `, allowedMentions: { repliedUser: false } })
            }
            if(User.user.id === message.author.id) {
                return message.reply({ content: `${emojis.negativo} | \`No puedes quitarte un warn a ti mismo\``, allowedMentions: { repliedUser: false } });
            }
            if(id === "all") {
                await Warn.deleteMany({ guildId: message.guild.id, warnedId: User.user.id });
                const Response = new MessageEmbed()
                    .setTitle("Información")
                    .setDescription(`${emojis.positivo} | \`Elimine correctamente todos los warns\``)
                    .setColor("BLUE")
                    .setTimestamp()
                    return message.reply({ embeds: [Response], allowedMentions: { repliedUser: false } });
            }
            const warn = await Warn.findOne({ warnId: id, guildId: message.guild.id });
            const AwaitResponse = new MessageEmbed()
            .setTitle("Información")
            .setDescription(`${emojis.cargando} | \`Obteniendo datos desde el servidor\``)
            .setColor("BLUE")
            let msg = await message.reply({ embeds: [AwaitResponse], allowedMentions: { repliedUser: false } });
            if(!warn) {
                const ErrorResponse = new MessageEmbed()
                .setTitle("Información")
                .setDescription(`${emojis.negativo} | \`No existe ese warn en mi base de datos\``)
                .setColor("BLUE")
                .setTimestamp()
                msg.edit({ embeds: [ErrorResponse], allowedMentions: { repliedUser: false } });
            } else {
                if(warn.guildId !== message.guild.id) {
                    const ErrorResponse = new MessageEmbed()
                    .setTitle("Información")
                    .setDescription(`${emojis.negativo} | \`No tienes acceso a esta advertencia\``)
                    .setColor("BLUE")
                    .setTimestamp()
                    msg.edit({ embeds: [ErrorResponse], allowedMentions: { repliedUser: false } });
                } else if(warn.warnedId !== User.user.id) {
                    const ErrorResponse = new MessageEmbed()
                    .setTitle("Información")
                    .setDescription(`${emojis.negativo} | \`Esta advertencia no pertenece a ese usuario\``)
                    .setColor("BLUE")
                    .setTimestamp()
                    msg.edit({ embeds: [ErrorResponse], allowedMentions: { repliedUser: false } });
                } else {
                    await Warn.findOneAndDelete({ warnId: id, guildId: message.guild.id })
                    const Response = new MessageEmbed()
                    .setTitle("Información")
                    .setDescription(`${emojis.positivo} | \`Elimine correctamente el warn\``)
                    .setColor("BLUE")
                    .setTimestamp()
                    msg.edit({ embeds: [Response], allowedMentions: { repliedUser: false } });
                }
            }
        } else if(message.member.permissions.has("KICK_MEMBERS")) {
            if(!message.guild.me.permissions.has("KICK_MEMBERS")) {
                return message.reply({ content: `No puedo interactuar con este comando sin los siguientes permisos: \`KICK_MEMBERS\``, allowedMentions: { repliedUser: false } });
            }
            const User = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
            const id = args[1];
            if(!User) {
                return message.reply({ content: `${emojis.negativo} | \`No se encuentra a ese usuario\` `, allowedMentions: { repliedUser: false } })
            }
            if(User.user.id === message.author.id) {
                return message.reply({ content: `${emojis.negativo} | \`No puedes quitarte un warn a ti mismo\``, allowedMentions: { repliedUser: false } });
            }
            if(id === "all") {
                await Warn.deleteMany({ guildId: message.guild.id, warnedId: User.user.id });
                const Response = new MessageEmbed()
                    .setTitle("Información")
                    .setDescription(`${emojis.positivo} | \`Elimine correctamente todos los warns\``)
                    .setColor("BLUE")
                    .setTimestamp()
                    return message.reply({ embeds: [Response], allowedMentions: { repliedUser: false } });
            }
            const warn = await Warn.findOne({ warnId: id, guildId: message.guild.id });
            const AwaitResponse = new MessageEmbed()
            .setTitle("Información")
            .setDescription(`${emojis.cargando} | \`Obteniendo datos desde el servidor\``)
            .setColor("BLUE")
            let msg = await message.reply({ embeds: [AwaitResponse], allowedMentions: { repliedUser: false } });
            if(!warn) {
                const ErrorResponse = new MessageEmbed()
                .setTitle("Información")
                .setDescription(`${emojis.negativo} | \`No existe ese warn en mi base de datos\``)
                .setColor("BLUE")
                .setTimestamp()
                msg.edit({ embeds: [ErrorResponse], allowedMentions: { repliedUser: false } });
            } else {
                if(warn.guildId !== message.guild.id) {
                    const ErrorResponse = new MessageEmbed()
                    .setTitle("Información")
                    .setDescription(`${emojis.negativo} | \`No tienes acceso a esta advertencia\``)
                    .setColor("BLUE")
                    .setTimestamp()
                    msg.edit({ embeds: [ErrorResponse], allowedMentions: { repliedUser: false } });
                } else if(warn.warnedId !== User.user.id) {
                    const ErrorResponse = new MessageEmbed()
                    .setTitle("Información")
                    .setDescription(`${emojis.negativo} | \`Esta advertencia no pertenece a ese usuario\``)
                    .setColor("BLUE")
                    .setTimestamp()
                    msg.edit({ embeds: [ErrorResponse], allowedMentions: { repliedUser: false } });
                } else {
                    await Warn.findOneAndDelete({ warnId: id, guildId: message.guild.id })
                    const Response = new MessageEmbed()
                    .setTitle("Información")
                    .setDescription(`${emojis.positivo} | \`Elimine correctamente el warn\``)
                    .setColor("BLUE")
                    .setTimestamp()
                    msg.edit({ embeds: [Response], allowedMentions: { repliedUser: false } });
                }
            }
        } else {
            return message.reply({ content: `${emojis.negativo} | \`No tienes permisos para ejecutar esta acción\` `, allowedMentions: { repliedUser: false } });
        }
    }
}