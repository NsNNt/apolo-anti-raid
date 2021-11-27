const { MessageEmbed, MessageActionRow, Message, MessageButton } = require("discord.js");
const emojis = require("../../emojis");
const Perms = require("../../Models/ModPerms");
const moment = require("moment");

module.exports = {
    name: "kick",
    aliases: ["expulsar", "k"],
    description: "Expulsa a un usuario de tu servidor",
    usage: "kick @Usuario <Razón>",
    permissions: "KICK_MEMBERS",
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
            if(!message.guild.me.permissions.has("KICK_MEMBERS")) {
                return message.reply({ content: `No puedo interactuar con este servidor sin los siguientes permisos: \`KICK_MEMBERS\``, allowedMentions: { repliedUser: false } });
            }
            const Target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
            const Razon = args.slice(1).join(" ");
            if(!Target?.user) {
                return message.channel.send({ content: "No se encontro a ese usuario.", allowedMentions: { repliedUser: false } });
            }
            if(Target.user.id === message.author.id) {
                return message.channel.send({ content: `No puedes expulsarte a ti mismo.`, allowedMentions: { repliedUser: false } });
            }
            if(Target.user.id === client.user.id) {
                return message.channel.send({ content: `No puedes expulsarme a mi...`, allowedMentions: { repliedUser: false } }); 
            }
            if(!Razon) {
                return message.channel.send({ content: `Proporciona una razón para la expulsión.`, allowedMentions: { repliedUser: false } });
            }
            if(Razon.length > 256) {
                return message.channel.send({ content: `La razón no puede ser mayor a 256 caracteres.`, allowedMentions: { repliedUser: false } });
            }
            if(message.member.roles.highest.comparePositionTo(Target.roles.highest) <= 0) {
                return message.channel.send({ content: `Este usuario tiene más o los mismos roles que tú.`, allowedMentions: { repliedUser: false } });
            }
            if(message.guild.me.roles.highest.comparePositionTo(Target.roles.highest) <= 0) {
                return message.channel.send({ content: `Este usuario tiene más o los mismos roles que yo. `, allowedMentions: { repliedUser: false } });
            }
            message.guild.members.kick(Target, `${Razon} - ${message.author.tag}`).catch(e => {});
            const Response = new MessageEmbed()
            .setTimestamp()
            .setColor("BLUE")
            .setDescription(`__\`${Target.user.tag}\` | ${Target.user.id} kickeado__\n\nModerador: \`${message.author.tag}\` | ${message.author.id}\nRazón: \`${Razon} | Día: ${moment().format("Do/MMMM/YYYY").replace("º", "")}\``)
            /* PARA EL USUARIO */
            const Response2 = new MessageEmbed()
            .setTimestamp()
            .setColor("BLUE")
            .setDescription(`__\`${Target.user.tag}\` | ${Target.user.id} fuiste kickeado__\n\nModerador: \`${message.author.tag}\` | ${message.author.id}\nRazón: \`${Razon} | Día: ${moment().format("Do/MMMM/YYYY").replace("º", "")}\``)
            message.channel.send({ embeds: [Response], allowedMentions: { repliedUser: false } });
            Target.send({ embeds: [Response2] }).catch(e => {});
        } else if(message.member.permissions.has("KICK_MEMBERS")) {
            if(!message.guild.me.permissions.has("KICK_MEMBERS")) {
                return message.reply({ content: `No puedo interactuar con este servidor sin los siguientes permisos: \`KICK_MEMBERS\``, allowedMentions: { repliedUser: false } });
            }
            const Target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
            const Razon = args.slice(1).join(" ");
            if(!Target?.user) {
                return message.channel.send({ content: "No se encontro a ese usuario.", allowedMentions: { repliedUser: false } });
            }
            if(Target.user.id === message.author.id) {
                return message.channel.send({ content: `No puedes expulsarte a ti mismo.`, allowedMentions: { repliedUser: false } });
            }
            if(Target.user.id === client.user.id) {
                return message.channel.send({ content: `No puedes expulsarme a mi...`, allowedMentions: { repliedUser: false } }); 
            }
            if(!Razon) {
                return message.channel.send({ content: `Proporciona una razón para la expulsión.`, allowedMentions: { repliedUser: false } });
            }
            if(Razon.length > 256) {
                return message.channel.send({ content: `La razón no puede ser mayor a 256 caracteres.`, allowedMentions: { repliedUser: false } });
            }
            if(message.member.roles.highest.comparePositionTo(Target.roles.highest) <= 0) {
                return message.channel.send({ content: `Este usuario tiene más o los mismos roles que tú.`, allowedMentions: { repliedUser: false } });
            }
            if(message.guild.me.roles.highest.comparePositionTo(Target.roles.highest) <= 0) {
                return message.channel.send({ content: `Este usuario tiene más o los mismos roles que yo. `, allowedMentions: { repliedUser: false } });
            }
            message.guild.members.kick(Target, `${Razon} - ${message.author.tag}`).catch(e => {});
            const Response = new MessageEmbed()
            .setTimestamp()
            .setColor("BLUE")
            .setDescription(`__\`${Target.user.tag}\` | ${Target.user.id} kickeado__\n\nModerador: \`${message.author.tag}\` | ${message.author.id}\nRazón: \`${Razon} | Día: ${moment().format("Do/MMMM/YYYY").replace("º", "")}\``)
            /* PARA EL USUARIO */
            const Response2 = new MessageEmbed()
            .setTimestamp()
            .setColor("BLUE")
            .setDescription(`__\`${Target.user.tag}\` | ${Target.user.id} fuiste kickeado__\n\nModerador: \`${message.author.tag}\` | ${message.author.id}\nRazón: \`${Razon} | Día: ${moment().format("Do/MMMM/YYYY").replace("º", "")}\``)
            message.channel.send({ embeds: [Response], allowedMentions: { repliedUser: false } });
            Target.send({ embeds: [Response2] }).catch(e => {});
        } else {
            return message.reply({ content: `${emojis.negativo} | \`No tienes permisos para ejecutar esta acción\` `, allowedMentions: { repliedUser: false } });
        }
    }
}