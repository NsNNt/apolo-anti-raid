const { MessageEmbed, MessageActionRow, Message, MessageButton, MessageSelectMenu } = require("discord.js");
const emojis = require("../../emojis");
const Premium = require("../../Models/UserPremium");
const Staff = require("../../Models/Staff");

module.exports = {
    name: "commands",
    aliases: ["cmds", "comandos"],
    description: "Ve mi lista de comandos",
    cooldown: 3,
    /**
     * @param {Message} message
     */
    async execute(message, args, commandName, client, Discord, prefix) {
        const UserIsPremium = await Premium.findOne({ userId: message.author.id });
        const UserIsStaff = await Staff.findOne({ userId: message.author.id });
        if(!message.author) {
            return;
        } else {
            if(!UserIsPremium) {
                if(!UserIsStaff) {
                    message.channel.send({
                        "embeds": [
                            {
                              "title": "`🤖` - Todos los comandos.",
                              "description": "`❔` **|** Para mas información de un comando utiliza: `"+prefix+"command {Comando}`\n`📚` **|** Para mas información del bot utiliza: `"+prefix+"help`\n`👑` **|** ¿Qué plan tengo? `Normal`",
                              "url": "https://discord.gg/tPWYAPhhwz",
                              "color": 11910143,
                              "fields": [
                                {
                                  "name": "🛡 | Protección",
                                  "value": "`anti-raid`, `anti-raid-config`, `raid-logs`, `anti-bots`, `anti-canales`, `anti-roles`, `anti-tokens`, `anti-malicious`, `anti-malicious-config`, `myperms`, `configuracion`, `whitelist`"
                                },
                                {
                                  "name": "⚙ | Configuración",
                                  "value": "`setprefix`, `set-mute-role`, `set-message-logs`, `set-mod-logs`, `set-verify-role`, `set-verify-channel`, `anti-palabras`, `auto-moderador`, `auto-moderador-config`, `lock`, `unlock`, `lock-all`, `unlock-all`, `nukeroles-pername`, `nukechannels-pername`, `perms`"
                                },
                                {
                                  "name": "🚧 | Moderación",
                                  "value": "`mute`, `unmute`, `warn`, `warnlist`, `warnremove`, `purge`, `kick`, `ban`, `hackban`, `tempban`, `unban`, `unbanall`, `forceban`, `detectar`, `nuke`"
                                },
                                {
                                  "name": "🤖 | Otros",
                                  "value": "`invite`, `member`, `premium`, `bot`, `reportar`, `help`, `command`"
                                }
                              ],
                              "footer": {
                                "text": "Apolo Security"
                              },
                              "timestamp": Date.now()
                            }
                        ]
                    });
                } else {
                    message.channel.send({
                        "embeds": [
                            {
                              "title": "`🤖` - Todos los comandos.",
                              "description": "`❔` **|** Para mas información de un comando utiliza: `"+prefix+"command {Comando}`\n`📚` **|** Para mas información del bot utiliza: `"+prefix+"help`\n`👑` **|** ¿Qué plan tengo? `Normal`",
                              "url": "https://discord.gg/tPWYAPhhwz",
                              "color": 11910143,
                              "fields": [
                                {
                                  "name": "🛡 | Protección",
                                  "value": "`anti-raid`, `anti-raid-config`, `raid-logs`, `anti-bots`, `anti-canales`, `anti-roles`, `anti-tokens`, `anti-malicious`, `anti-malicious-config`, `myperms`, `configuracion`, `whitelist`"
                                },
                                {
                                  "name": "⚙ | Configuración",
                                  "value": "`setprefix`, `set-mute-role`, `set-message-logs`, `set-mod-logs`, `set-verify-role`, `set-verify-channel`, `anti-palabras`, `auto-moderador`, `auto-moderador-config`, `lock`, `unlock`, `lock-all`, `unlock-all`, `nukeroles-pername`, `nukechannels-pername`, `perms`"
                                },
                                {
                                  "name": "🚧 | Moderación",
                                  "value": "`mute`, `unmute`, `warn`, `warnlist`, `warnremove`, `purge`, `kick`, `ban`, `hackban`, `tempban`, `unban`, `unbanall`, `forceban`, `detectar`, `nuke`"
                                },
                                {
                                  "name": "🤖 | Otros",
                                  "value": "`invite`, `member`, `premium`, `bot`, `reportar`, `help`, `command`"
                                },
                                {
                                  "name": "💼 | Agentes",
                                  "value": "`kick-malicious`, `audit-logs`, `force-unban`, `force-ban-malicious`"
                                }
                              ],
                              "footer": {
                                "text": "Apolo Security"
                              },
                              "timestamp": Date.now()
                            }
                        ]
                    });
                }
            } else {
                if(!UserIsStaff) {
                    message.channel.send({
                        "embeds": [
                            {
                              "title": "`🤖` - Todos los comandos.",
                              "description": "`❔` **|** Para mas información de un comando utiliza: `"+prefix+"command {Comando}`\n`📚` **|** Para mas información del bot utiliza: `"+prefix+"help`\n`👑` **|** ¿Qué plan tengo? `Premium`",
                              "url": "https://discord.gg/tPWYAPhhwz",
                              "color": 16776373,
                              "fields": [
                                {
                                  "name": "🛡 | Protección",
                                  "value": "`anti-raid`, `anti-raid-config`, `raid-logs`, `anti-bots`, `anti-canales`, `anti-roles`, `anti-tokens`, `anti-malicious`, `anti-malicious-config`, `myperms`, `configuracion`, `whitelist`"
                                },
                                {
                                  "name": "⚙ | Configuración",
                                  "value": "`setprefix`, `set-mute-role`, `set-message-logs`, `set-mod-logs`, `set-verify-role`, `set-verify-channel`, `anti-palabras`, `auto-moderador`, `auto-moderador-config`, `lock`, `unlock`, `lock-all`, `unlock-all`, `nukeroles-pername`, `nukechannels-pername`, `perms`"
                                },
                                {
                                  "name": "🚧 | Moderación",
                                  "value": "`mute`, `unmute`, `warn`, `warnlist`, `warnremove`, `purge`, `kick`, `ban`, `hackban`, `tempban`, `unban`, `unbanall`, `forceban`, `detectar`, `nuke`"
                                },
                                {
                                  "name": "🤖 | Otros",
                                  "value": "`invite`, `member`, `premium`, `bot`, `reportar`, `help`, `command`"
                                },
                                {
                                  "name": "👑 | Premium",
                                  "value": "`backup`, `backup-list`, `backup-crear`, `backup-cargar`, `backup-eliminar`, `purgeme`"
                                }
                              ],
                              "footer": {
                                "text": "Apolo Security"
                              },
                              "timestamp": Date.now()
                            }
                        ]
                    });
                } else {
                    message.channel.send({
                        "embeds": [
                            {
                              "title": "`🤖` - Todos los comandos.",
                              "description": "`❔` **|** Para mas información de un comando utiliza: `"+prefix+"command {Comando}`\n`📚` **|** Para mas información del bot utiliza: `"+prefix+"help`\n`👑` **|** ¿Qué plan tengo? `Premium`",
                              "url": "https://discord.gg/tPWYAPhhwz",
                              "color": 16776373,
                              "fields": [
                                {
                                  "name": "🛡 | Protección",
                                  "value": "`anti-raid`, `anti-raid-config`, `raid-logs`, `anti-bots`, `anti-canales`, `anti-roles`, `anti-tokens`, `anti-malicious`, `anti-malicious-config`, `myperms`, `configuracion`, `whitelist`"
                                },
                                {
                                  "name": "⚙ | Configuración",
                                  "value": "`setprefix`, `set-mute-role`, `set-message-logs`, `set-mod-logs`, `set-verify-role`, `set-verify-channel`, `anti-palabras`, `auto-moderador`, `auto-moderador-config`, `lock`, `unlock`, `lock-all`, `unlock-all`, `nukeroles-pername`, `nukechannels-pername`, `perms`"
                                },
                                {
                                  "name": "🚧 | Moderación",
                                  "value": "`mute`, `unmute`, `warn`, `warnlist`, `warnremove`, `purge`, `kick`, `ban`, `hackban`, `tempban`, `unban`, `unbanall`, `forceban`, `detectar`, `nuke`"
                                },
                                {
                                  "name": "🤖 | Otros",
                                  "value": "`invite`, `member`, `premium`, `bot`, `reportar`, `help`, `command`"
                                },
                                {
                                  "name": "👑 | Premium",
                                  "value": "`backup`, `backup-list`, `backup-crear`, `backup-cargar`, `backup-eliminar`, `purgeme`"
                                },
                                {
                                  "name": "💼 | Agentes",
                                  "value": "`kick-malicious`, `audit-logs`, `force-unban`, `force-ban-malicious`"
                                }
                              ],
                              "footer": {
                                "text": "Apolo Security"
                              },
                              "timestamp": Date.now()
                            }
                        ]
                    })
                }
            }
        }
    }
}