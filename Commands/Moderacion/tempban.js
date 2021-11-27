const { MessageEmbed, MessageActionRow, Message, MessageButton } = require("discord.js");
const emojis = require("../../emojis");
const moment = require("moment");
const ms = require("ms");
const Perms = require("../../Models/ModPerms");

module.exports = {
    name: "tempban",
    description: "Banea a un usuario temporalmente de tu servidor.",
    aliases: ["tempb", "temp-ban"],
    usage: "tempban <@Usuario> <Tiempo> [Razón]",
    permissions: "BAN_MEMBERS",
    cooldown: 3,
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
            	return message.channel.send({ content: "No tengo permisos de __banear miembros__ en este servidor." });   
            }
            const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
            const tiempo = args[1];
            let razon = args.slice(2).join(" ");
            if(!user) {
                return message.channel.send({ content: "No existe ese usuario en este servidor." });
            }
            if(user.user.id === message.author.id) {
                return message.channel.send({ content: "No puedes banearte a ti mismo." })
            }
            if(user.user.id === client.user.id) {
                return message.channel.send({ content: "Qué??, ¿Por qué?" });
            }
            if(!tiempo) {
                return message.channel.send({ content: "Por favor proporcione el tiempo que estara baneado el usuario." });
            }
            if(!['s', 'd', 'm'].some(t => tiempo.toLowerCase().endsWith(t))) {
                return message.channel.send({ content: "Ese no es un formato de tiempo valido! utiliza: `s`, `d`, `m`" });
            }
            if(!razon) {
                razon = "No se proporcionó razón."
            }
            if(razon.length > 256) {
                return message.channel.send({ content: "La razón debe ser menor a 256 caracteres." });
            }
            if(message.member.roles.highest.comparePositionTo(user.roles.highest) <= 0) {
                return message.channel.send({ content: "Este usuario tiene más o los mismos roles que tú." });
            }
            if(message.guild.me.roles.highest.comparePositionTo(user.roles.highest) <= 0) {
                return message.channel.send({ content: "Este usuario tiene más o los mismos roles que yo" });
            }
            message.channel.send({
                embeds: [
                    {
                        title: "Usuario baneado temporalmente",
                        description: `\`${user.user.tag}\` fue baneado de este servidor.`,
                        color: "BLURPLE",
                        fields: [
                            {
                                name: "⏱ Tiempo",
                                value: `${tiempo} (${ms(tiempo)}ms)`
                            },
                            {
                                name: "🕵🏻‍♀️ Moderador",
                                value: `${message.author} | \`${message.author.id}\``
                            },
                            {
                                name: "🔨 Baneado",
                                value: `${user.user.tag} | \`${user.id}\``
                            }
                        ],
                        timestamp: Date.now(),
                        footer: {
                            text: `${message.guild.name}, ${message.guild.id}`
                        }
                    }
                ]
            });
            message.guild.members.ban(user, {
                reason: `${razon} - ${message.author.tag}`
            });
            setTimeout(async () => {
                await message.guild.bans.fetch().then(bans => {
                	if(bans.size === 0) {
                        return;
                    }
                    const userbanned = bans.find(b => b.user.id === user.id);
                    if(!userbanned) {
                        return;
                    } else {
                        message.guild.members.unban(userbanned.user.id, `${tiempo} concluidos.`);
                    }
                });
            }, ms(tiempo));
        } else if(message.member.permissions.has("BAN_MEMBERS")) {
            if(!message.guild.me.permissions.has("BAN_MEMBERS")) {
            	return message.channel.send({ content: "No tengo permisos de __banear miembros__ en este servidor." });   
            }
            const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
            const tiempo = args[1];
            let razon = args.slice(2).join(" ");
            if(!user) {
                return message.channel.send({ content: "No existe ese usuario en este servidor." });
            }
            if(user.user.id === message.author.id) {
                return message.channel.send({ content: "No puedes banearte a ti mismo." })
            }
            if(user.user.id === client.user.id) {
                return message.channel.send({ content: "Qué??, ¿Por qué?" });
            }
            if(!tiempo) {
                return message.channel.send({ content: "Por favor proporcione el tiempo que estara baneado el usuario." });
            }
            if(!['s', 'd', 'm'].some(t => tiempo.toLowerCase().endsWith(t))) {
                return message.channel.send({ content: "Ese no es un formato de tiempo valido! utiliza: `s`, `d`, `m`" });
            }
            if(!razon) {
                razon = "No se proporcionó razón."
            }
            if(razon.length > 256) {
                return message.channel.send({ content: "La razón debe ser menor a 256 caracteres." });
            }
            if(message.member.roles.highest.comparePositionTo(user.roles.highest) <= 0) {
                return message.channel.send({ content: "Este usuario tiene más o los mismos roles que tú." });
            }
            if(message.guild.me.roles.highest.comparePositionTo(user.roles.highest) <= 0) {
                return message.channel.send({ content: "Este usuario tiene más o los mismos roles que yo" });
            }
            message.channel.send({
                embeds: [
                    {
                        title: "Usuario baneado temporalmente",
                        description: `\`${user.user.tag}\` fue baneado de este servidor.`,
                        color: "BLURPLE",
                        fields: [
                            {
                                name: "⏱ Tiempo",
                                value: `${tiempo} (${ms(tiempo)}ms)`
                            },
                            {
                                name: "🕵🏻‍♀️ Moderador",
                                value: `${message.author} | \`${message.author.id}\``
                            },
                            {
                                name: "🔨 Baneado",
                                value: `${user.user.tag} | \`${user.id}\``
                            }
                        ],
                        timestamp: Date.now(),
                        footer: {
                            text: `${message.guild.name}, ${message.guild.id}`
                        }
                    }
                ]
            });
            message.guild.members.ban(user, {
                reason: `${razon} - ${message.author.tag}`
            });
            setTimeout(async () => {
                await message.guild.bans.fetch().then(bans => {
                	if(bans.size === 0) {
                        return;
                    }
                    const userbanned = bans.find(b => b.user.id === user.id);
                    if(!userbanned) {
                        return;
                    } else {
                        message.guild.members.unban(userbanned.user.id, `${tiempo} concluidos.`);
                    }
                });
            }, ms(tiempo));
        } else {
            return message.channel.send({ content: "No tienes permisos para ejecutar este comando." });
        }
    }
}