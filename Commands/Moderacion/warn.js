const { MessageEmbed, MessageActionRow, Message, MessageButton, Client } = require("discord.js");
const emojis = require("../../emojis");
const Perms = require("../../Models/ModPerms");
const Warn = require("../../Models/Warn");
const ModLogs = require("../../Models/modLogs");
const moment = require("moment");

module.exports = {
    name: "warn",
    aliases: ["warnear"],
    description: "Advierte a un usuario del servidor",
    usage: "warn @Usuario <Razón>",
    permissions: "KICK_MEMBERS",
    cooldown: 5,
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
            if(!message.guild.me.permissions.has("KICK_MEMBERS")) {
                return message.reply({ content: `No puedo interactuar con este comando sin los siguientes permisos: \`KICK_MEMBERS\``, allowedMentions: { repliedUser: false } });
            }
            const Usuario = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
            const Razon = args.slice(1).join(" ");
            if(!Usuario) {
                return message.reply({ content: `${emojis.negativo} | \`Por favor proporciona a un usuario para warnear\``, allowedMentions: { repliedUser: false } });
            }
            if(Usuario.user.id === message.author.id) {
                return message.reply({ content: `${emojis.negativo} | \`No puedes warnearte a ti mismo\``, allowedMentions: { repliedUser: false } });
            }
            const FindAnteriores = await Warn.find({ warnedId: Usuario.user.id, guildId: message.guild.id });
            const FindTodos = await Warn.find({ guildId: message.guild.id });
            const modLogs = await ModLogs.findOne({ guildId: message.guild.id });
            let Anteriores = 0;
            let TAnteriores = 0;
            let channelId;
            if(Razon?.length >= 256) {
                return message.reply({ content: `${emojis.negativo} | \`La razon no puede ser mayor a 256 caracteres\``, allowedMentions: { repliedUser: false } });
            }
            if(!FindAnteriores) {
                Anteriores = 0;
            } else {
                Anteriores = FindAnteriores.length;
            }
            if(!modLogs) {
                channelId = message.channel.id
            } else {
                if(!modLogs?.actived) {
                    channelId = message.channel.id
                } else {
                    channelId = message.guild.channels.cache.get(modLogs.channelId).id || message.channel.id;
                }
            }
            const channel = await message.guild.channels.cache.get(channelId);
            if(!FindTodos) {
                TAnteriores = 0;
            } else {
                TAnteriores = FindTodos.length;
            }
            const createNewWarn = new Warn({
                warnedId: Usuario.user.id,
                warnedTag: Usuario.user.tag,
                modId: message.author.id,
                modTag: message.author.tag,
                razon: Razon || "No se proporciono razón",
                guildId: message.guild.id,
                warnCreated: moment(Date.now()).format("Do/MM/YYYY").replace("º", ""),
                warnId: TAnteriores + 1
            });
            await createNewWarn.save();
            message.channel.send({ content: `${Usuario} fue warneado.` });
            channel.send({ embeds: [
                {
                    title: "Nuevo warn.",
                    description: `${Usuario} | ${Usuario.id} fue warneado.`,
                    fields: [
                        {
                            name: "Moderador",
                            value: `\`${message.author.username}\` | ${message.author.id}`,
                            inline: true
                        },
                        {
                            name: "Warneado",
                            value: `\`${Usuario.user.username}\` | ${Usuario.id}`,
                            inline: true
                        },
                        {
                            name: "Razon",
                            value: `${Razon ? Razon : `Moderadores usen \`${prefix}razon ${createNewWarn.warnId} [Razón]\``}`
                        }
                    ],
                    color: "BLUE",
                    footer: {
                        text: `Caso #${createNewWarn.warnId} | El usuario tiene ${Anteriores + 1} warns.`
                    }
                }
            ], allowedMentions : { repliedUser: false } });
        } else if(message.member.permissions.has("KICK_MEMBERS")) {
            
            if(!message.guild.me.permissions.has("KICK_MEMBERS")) {
                return message.reply({ content: `No puedo interactuar con este comando sin los siguientes permisos: \`KICK_MEMBERS\``, allowedMentions: { repliedUser: false } });
            }
            const Usuario = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
            const Razon = args.slice(1).join(" ");
            if(!Usuario) {
                return message.reply({ content: `${emojis.negativo} | \`Por favor proporciona a un usuario para warnear\``, allowedMentions: { repliedUser: false } });
            }
            if(Usuario.user.id === message.author.id) {
                return message.reply({ content: `${emojis.negativo} | \`No puedes warnearte a ti mismo\``, allowedMentions: { repliedUser: false } });
            }
            const FindAnteriores = await Warn.find({ warnedId: Usuario.user.id, guildId: message.guild.id });
            const FindTodos = await Warn.find({ guildId: message.guild.id });
            const modLogs = await ModLogs.findOne({ guildId: message.guild.id });
            let Anteriores = 0;
            let TAnteriores = 0;
            let channelId;
            if(Razon?.length >= 256) {
                return message.reply({ content: `${emojis.negativo} | \`La razon no puede ser mayor a 256 caracteres\``, allowedMentions: { repliedUser: false } });
            }
            if(!FindAnteriores) {
                Anteriores = 0;
            } else {
                Anteriores = FindAnteriores.length;
            }
            if(!modLogs) {
                channelId = message.channel.id
            } else {
                if(!modLogs?.actived) {
                    channelId = message.channel.id
                } else {
                    channelId = message.guild.channels.cache.get(modLogs.channelId).id || message.channel.id;
                }
            }
            const channel = await message.guild.channels.cache.get(channelId);
            if(!FindTodos) {
                TAnteriores = 0;
            } else {
                TAnteriores = FindTodos.length;
            }
            const createNewWarn = new Warn({
                warnedId: Usuario.user.id,
                warnedTag: Usuario.user.tag,
                modId: message.author.id,
                modTag: message.author.tag,
                razon: Razon || "No se proporciono razón",
                guildId: message.guild.id,
                warnCreated: moment(Date.now()).format("Do/MM/YYYY").replace("º", ""),
                warnId: TAnteriores + 1
            });
            await createNewWarn.save();
            message.channel.send({ content: `${Usuario} fue warneado.` });
            channel.send({ embeds: [
                {
                    title: "Nuevo warn.",
                    description: `${Usuario} | ${Usuario.id} fue warneado.`,
                    fields: [
                        {
                            name: "Moderador",
                            value: `\`${message.author.username}\` | ${message.author.id}`,
                            inline: true
                        },
                        {
                            name: "Warneado",
                            value: `\`${Usuario.user.username}\` | ${Usuario.id}`,
                            inline: true
                        },
                        {
                            name: "Razon",
                            value: `${Razon ? Razon : `Moderadores usen \`${prefix}razon ${createNewWarn.warnId} [Razón]\``}`
                        }
                    ],
                    color: "BLUE",
                    footer: {
                        text: `Caso #${createNewWarn.warnId} | El usuario tiene ${Anteriores + 1} warns.`
                    }
                }
            ], allowedMentions : { repliedUser: false } });
        } else {
            return message.reply({ content: `${emojis.negativo} | \`No tienes permisos para ejecutar esta acción\` `, allowedMentions: { repliedUser: false } });
        }
    }
}