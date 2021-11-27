const { MessageEmbed, MessageActionRow, Message, MessageButton, Client } = require("discord.js");
const emojis = require("../../emojis");
const Perms = require("../../Models/ModPerms");

module.exports = {
    name: "perms",
    aliases: ["permisos"],
    description: "Configura los permisos de un rol en este servidor (Solo funciona con el modulo de moderación)",
    permissions: "ADMINISTRATOR",
    usage: "permisos @Rol <añadir/remover/lista>",
    /**
     * @param {Message} message
     * @param {Client} Client
     */
    async execute(message, args, commandName, client, Discord, prefix) {
        if(!message.member.permissions.has("ADMINISTRATOR")) {
            return message.reply({ content: `${emojis.negativo} | \`No tienes permisos para ejecutar esta acción\` `, allowedMentions: { repliedUser: false } });
        }
        if(!message.guild.me.permissions.has("ADMINISTRATOR")) {
            return message.reply({ content: `No puedo interactuar con este servidor sin los siguientes permisos: \`ADMINISTRADOR\``, allowedMentions: { repliedUser: false } });
        }
        const Role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);
        if(!Role) {
            return message.reply({ content: `Menciona un rol para cambiar sus permisos`, allowedMentions: { repliedUser: false } });
        } else {
            const Commands = ["ban", "warn", "razon", "mute", "clear", "purge", "warns", "warnlist", "kick", "unmute", "warnremove", "hackban", "unban", "forceban", "nuke", "unbanall"];
            const Actions = ["añadir", "remover", "lista"]
            const Action = args[1];
            const Command = args[2]
            if(!Action) {
                const Embed = new MessageEmbed()
                .setTitle("Información")
                .setDescription(`${emojis.negativo} | \`Esa acción no esta disponible, el uso correcto es ${prefix}permisos @Rol [añadir/remover/lista] [comando]\``)
                .setColor("BLUE")

                return message.reply({ embeds: [Embed], allowedMentions: { repliedUser: false } });
            }
            if(Action === "lista") {
                const RoleFind1 = await Perms.findOne({ roleId: Role.id, guildId: message.guild.id });
                let Aceptados;
                let Denegados;
                if(!RoleFind1) {
                    const createRole = new Perms({
                        guildId: message.guild.id,
                        roleId: Role.id,
                        allowed: [],
                        denied: []
                    });
                    await createRole.save();
                    if(createRole?.allowed.length <= 0) {
                        Aceptados = "-"
                    }
                    if(createRole?.denied.length <= 0) {
                        Denegados = "-"
                    }
                    Aceptados = createRole?.allowed.map((c) => `\n${c}`).join(" ")
                    Denegados = createRole?.denied.map((c) => `\n${c}`).join(" ")
                    const Response = new MessageEmbed()
                    .setDescription(`- Permisos del rol ${Role}`)
                    .addField(`Alojados`, `${Aceptados ? Aceptados : "`-`"}`)
                    .addField(`Denegados`, `${Denegados ? Denegados : "`-`"}`)
                    .setColor("BLUE")
                    return message.reply({ embeds: [Response], allowedMentions: { repliedUser: false } });
                } else {
                    if(RoleFind1?.allowed.length <= 0) {
                        Aceptados = "-"
                    }
                    if(RoleFind1?.denied.length <= 0) {
                        Denegados = "-"
                    }
                    Aceptados = RoleFind1?.allowed.map((c) => `\n${c}`).join(" ")
                    Denegados = RoleFind1?.denied.map((c) => `\n${c}`).join(" ")
                    const Response = new MessageEmbed()
                    .setDescription(`- Permisos del rol ${Role}`)
                    .addField(`Alojados`, `${Aceptados ? Aceptados : "`-`"}`)
                    .addField(`Denegados`, `${Denegados ? Denegados : "`-`"}`)
                    .setColor("BLUE")
                    return message.reply({ embeds: [Response], allowedMentions: { repliedUser: false } });
                }
            }
            if(!Command) {
                const Embed = new MessageEmbed()
                .setTitle("Información")
                .setDescription(`${emojis.negativo} | \`Ese comando no esta disponible, solo estan disponibles comandos de moderación\``)
                .setColor("BLUE")

                return message.reply({ embeds: [Embed], allowedMentions: { repliedUser: false } });
            }
            console.log(Command)
            if(!Actions.includes(Action.toLowerCase())) {
                const Embed = new MessageEmbed()
                .setTitle("Información")
                .setDescription(`${emojis.negativo} | \`Esa acción no esta disponible, el uso correcto es ${prefix}permisos @Rol [añadir/remover/lista] [comando]\``)
                .setColor("BLUE")

                message.reply({ embeds: [Embed], allowedMentions: { repliedUser: false } });
            } else {
                if(!Commands.includes(Command.toLowerCase())) {
                    const Embed = new MessageEmbed()
                    .setTitle("Información")
                    .setDescription(`${emojis.negativo} | \`Ese comando no esta disponible, solo estan disponibles comandos de moderación\``)
                    .setColor("BLUE")
    
                    message.reply({ embeds: [Embed], allowedMentions: { repliedUser: false } });
                } else {
                    if(Action === "añadir") {
                        const RoleFind = await Perms.findOne({ roleId: Role.id, guildId: message.guild.id });
                        if(!RoleFind) {
                            const createRole = new Perms({
                                guildId: message.guild.id,
                                roleId: Role.id,
                                allowed: [],
                                denied: []
                            });
                            await createRole.save();
                            createRole.allowed.push(Command.toLowerCase());
                            await createRole.save();
                            const Response = new MessageEmbed()
                            .setTitle("Información")
                            .setDescription(`${emojis.positivo} | Añadido el permiso \`${Command.toLowerCase()}\` a el rol ${Role}`)
                            .setColor("BLUE")
                            message.reply({ embeds: [Response], allowedMentions: { repliedUser: false } });
                        } else {
                            if(RoleFind?.denied.includes(Command.toLowerCase())) {
                                const i = RoleFind?.denied.indexOf(Command.toLowerCase())
                                RoleFind?.denied.splice(i, 1)
                                await RoleFind.save();
                                RoleFind?.allowed.push(Command.toLowerCase())
                                await RoleFind.save();
                                const Response = new MessageEmbed()
                                .setTitle("Información")
                                .setDescription(`${emojis.positivo} | Añadido el permiso \`${Command.toLowerCase()}\` a el rol ${Role}`)
                                .setColor("BLUE")
                                message.reply({ embeds: [Response], allowedMentions: { repliedUser: false } });
                            } else if(RoleFind?.allowed.includes(Command.toLowerCase())) {
                                const Response = new MessageEmbed()
                                .setTitle("Información")
                                .setDescription(`${emojis.positivo} | Añadido el permiso \`${Command.toLowerCase()}\` a el rol ${Role}`)
                                .setColor("BLUE")
                                message.reply({ embeds: [Response], allowedMentions: { repliedUser: false } });
                            } else {
                                RoleFind?.allowed.push(Command.toLowerCase());
                                await RoleFind.save();
                                const Response = new MessageEmbed()
                                .setTitle("Información")
                                .setDescription(`${emojis.positivo} | Añadido el permiso \`${Command.toLowerCase()}\` a el rol ${Role}`)
                                .setColor("BLUE")
                                message.reply({ embeds: [Response], allowedMentions: { repliedUser: false } });
                            }
                        }
                    } else if(Action === "remover") {
                        const RoleFind = await Perms.findOne({ roleId: Role.id, guildId: message.guild.id });
                        if(!RoleFind) {
                            const createRole = new Perms({
                                guildId: message.guild.id,
                                roleId: Role.id,
                                allowed: [],
                                denied: []
                            });
                            await createRole.save();
                            createRole.denied.push(Command.toLowerCase());
                            await createRole.save();
                            const Response = new MessageEmbed()
                            .setTitle("Información")
                            .setDescription(`${emojis.positivo} | Denegado el permiso \`${Command.toLowerCase()}\` a el rol ${Role}`)
                            .setColor("BLUE")
                            message.reply({ embeds: [Response], allowedMentions: { repliedUser: false } });
                        } else {
                            if(RoleFind?.allowed.includes(Command.toLowerCase())) {
                                if(RoleFind?.allowed.some(e => e === Command.toLowerCase())) {
                                    const i = RoleFind?.allowed.indexOf(Command.toLowerCase())
                                    RoleFind?.allowed.splice(i, 1)
                                    await RoleFind.save();
                                    RoleFind?.denied.push(Command)
                                    await RoleFind.save();
                                    const Response = new MessageEmbed()
                                    .setTitle("Información")
                                    .setDescription(`${emojis.positivo} | Denegado el permiso \`${Command.toLowerCase()}\` a el rol ${Role}`)
                                    .setColor("BLUE")
                                    message.reply({ embeds: [Response], allowedMentions: { repliedUser: false } });
                                } else {
                                    return message.reply({ content: `No se encontro ese permiso!`, allowedMentions: { repliedUser: false } });
                                }
                            } else {
                                RoleFind?.denied.push(Command.toLowerCase())
                                await RoleFind.save();
                                const Response = new MessageEmbed()
                                .setTitle("Información")
                                .setDescription(`${emojis.positivo} | Denegado el permiso \`${Command.toLowerCase()}\` a el rol ${Role}`)
                                .setColor("BLUE")
                                message.reply({ embeds: [Response], allowedMentions: { repliedUser: false } });
                            }
                        }
                    }
                }
            }
        }
    }
}