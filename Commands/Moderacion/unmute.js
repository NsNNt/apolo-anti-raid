const { MessageEmbed, MessageActionRow, Message, MessageButton, Client } = require("discord.js");
const MutedRole = require("../../Models/MutedRole");
const Muted = require("../../Models/Muted");
const emojis = require("../../emojis");
const Perms = require("../../Models/ModPerms");

module.exports = {
    name: "unmute",
    aliases: ["desmutear"],
    description: "Desmutea a un usuario",
    usage: "unmute @Usuario [Razón]",
    permissions: "MANAGE_ROLES",
    /**
     * @param {Message} message
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
            if(!message.guild.me.permissions.has("MANAGE_ROLES")) {
                return message.reply({ content: `No puedo interactuar con este comando sin los siguientes permisos: \`MANAGE_ROLES\``, allowedMentions: { repliedUser: false } });
            }
            const Target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
            const MuteRole = await MutedRole.findOne({ guildId: message.guild.id });
            if(MuteRole) {
                const Role = message.guild.roles.cache.get(MuteRole.roleId);
                let Razon = args.slice(1).join(" ");
                if(!Target) {
                    return message.reply({ content: `${emojis.negativo} | \`Menciona a un usuario para desmutear\` `, allowedMentions: { repliedUser: false } });
                }
                if(Target.user.id === message.author.id) {
                    return message.reply({ content: `${emojis.negativo} | \`No te puedes desmutear a ti mismo\` `, allowedMentions: { repliedUser: false } });
                }
                if(!Razon) {
                    Razon = "No se proporciono razón."
                }
                if(Razon.length > 256) {
                    return message.reply({ content: `${emojis.negativo} | \`La razón no puede ser mayor a 256 caracteres\` `, allowedMentions: { repliedUser: false } });
                }
                if(!Target.roles.cache.has(Role.id)) {
                    return message.reply({ content: `${emojis.negativo} | \`Este usuario no esta muteado\` `, allowedMentions: { repliedUser: false } });
                }
                Target.roles.remove(Role).catch((e) => {
                    return message.channel.send({ content: `Algo salio mal, porfavor contacta con mi soporte: https://discord.gg/ZQCcer2XsF` });
                });
                const desmuteUser = await Muted.findOneAndDelete({ userId: Target.user.id, guildId: message.guild.id })
                const Embed = new MessageEmbed()
                .setDescription(`${Target} | ${Target.user.id} fue desmuteado\n\nModerador: ${message.author} | ${message.author.id}\nRazón: \`${Razon}\`\n`)
                .setTimestamp()
                .setColor("BLUE")
                const Embed2 = new MessageEmbed()
                .setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true }) || client.user.avatarURL({ dynamic: true }))
                .setDescription(`${Target} | ${Target.user.id} fuiste desmuteado\n\nModerador: ${message.author} | ${message.author.id}\nRazón: \`${Razon}\`\n`)
                .setTimestamp()
                .setColor("BLUE")
                message.reply({ embeds: [Embed], allowedMentions: { repliedUser: false } });
                Target.send({ embeds: [Embed2] }).catch(e => {});
            } else {
                return message.reply({ content: `${emojis.negativo} | \`No existe un rol predeterminado para mutear/desmutear\` `, allowedMentions: { repliedUser: false } });
            }
        } else if(message.member.permissions.has("MANAGE_ROLES")) {
            if(!message.guild.me.permissions.has("MANAGE_ROLES")) {
                return message.reply({ content: `No puedo interactuar con este comando sin los siguientes permisos: \`MANAGE_ROLES\``, allowedMentions: { repliedUser: false } });
            }
            const Target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
            const MuteRole = await MutedRole.findOne({ guildId: message.guild.id });
            if(MuteRole) {
                const Role = message.guild.roles.cache.get(MuteRole.roleId);
                let Razon = args.slice(1).join(" ");
                if(!Target) {
                    return message.reply({ content: `${emojis.negativo} | \`Menciona a un usuario para desmutear\` `, allowedMentions: { repliedUser: false } });
                }
                if(Target.user.id === message.author.id) {
                    return message.reply({ content: `${emojis.negativo} | \`No te puedes desmutear a ti mismo\` `, allowedMentions: { repliedUser: false } });
                }
                if(!Razon) {
                    Razon = "No se proporciono razón."
                }
                if(Razon.length > 256) {
                    return message.reply({ content: `${emojis.negativo} | \`La razón no puede ser mayor a 256 caracteres\` `, allowedMentions: { repliedUser: false } });
                }
                if(!Target.roles.cache.has(Role.id)) {
                    return message.reply({ content: `${emojis.negativo} | \`Este usuario no esta muteado\` `, allowedMentions: { repliedUser: false } });
                }
                Target.roles.remove(Role).catch((e) => {
                    return message.channel.send({ content: `Algo salio mal, porfavor contacta con mi soporte: https://discord.gg/ZQCcer2XsF` });
                });
                const desmuteUser = await Muted.findOneAndDelete({ userId: Target.user.id, guildId: message.guild.id })
                const Embed = new MessageEmbed()
                .setDescription(`${Target} | ${Target.user.id} fue desmuteado\n\nModerador: ${message.author} | ${message.author.id}\nRazón: \`${Razon}\`\n`)
                .setTimestamp()
                .setColor("BLUE")
                const Embed2 = new MessageEmbed()
                .setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true }) || client.user.avatarURL({ dynamic: true }))
                .setDescription(`${Target} | ${Target.user.id} fuiste desmuteado\n\nModerador: ${message.author} | ${message.author.id}\nRazón: \`${Razon}\`\n`)
                .setTimestamp()
                .setColor("BLUE")
                message.reply({ embeds: [Embed], allowedMentions: { repliedUser: false } });
                Target.send({ embeds: [Embed2] }).catch(e => {});
            } else {
                return message.reply({ content: `${emojis.negativo} | \`No existe un rol predeterminado para mutear/desmutear\` `, allowedMentions: { repliedUser: false } });
            }
        } else {
            return message.reply({ content: `${emojis.negativo} | \`No tienes permisos para ejecutar esta acción\` `, allowedMentions: { repliedUser: false } });
        }
    }
}