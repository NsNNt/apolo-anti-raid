const { MessageEmbed, MessageActionRow, Message, MessageButton } = require("discord.js");
const Malicious = require("../../Models/Malicious");
const emojis = require("../../emojis");

module.exports = {
    name: "anti-malicious-config",
    aliases: ["antimaliciousconfig"],
    description: "Configura el anti-maliciosos en tu servidor",
    usage: "anti-malicious-config",
    cooldown: 5,
    permissions: "ADMINISTRATOR",
    /**
     * @param {Message} message
     */
    async execute(message, args, commandName, client, Discord, prefix) {
        if(!message.member.permissions.has("ADMINISTRATOR")) {
            return message.channel.send({ content: "No tienes __permisos de administrador__ para hacer esto." });
        }
        if(!message.guild.me.permissions.has("ADMINISTRATOR")) {
            return message.channel.send({ content: "Necesito __permisos de administrador__ para protegerlo de usuarios maliciosos." });
        }
        const thisGuild = await Malicious.findOne({ guildId: message.guild.id });
        if(!thisGuild) {
            return message.channel.send({ content: "El anti-maliciosos __no esta activado__ en este servidor, utiliza `"+prefix+"anti-malicious`." })
        }
        if(!thisGuild?.actived) {
            return message.channel.send({ content: "El anti-maliciosos __no esta activado__ en este servidor, utiliza `"+prefix+"anti-malicious`." })
        }
        let msg = await message.channel.send({
            "embeds": [
                {
                  "title": "`📰` - Configuración Anti-Maliciosos",
                  "description": "> `{🔨}` - `No permitas que los usuarios maliciosos entren a tu servidor sin ser detectados. Configura este modulo y veras como ningun usuario malicioso entra a este servidor!.`\n\n`[✅]` `|` **Reacciona con uno de estos emojis para continuar:**\n`{⚙}` **`|`** `Configurar el anti-maliciosos`\n`{❔}` **`|`** `Configuración del anti-maliciosos`\n`{❌}` **`|`** `Cancelar comando`\n\n> Nota. `Este comando esta en fase BETA, cualquier error favor de reportarlo con "+prefix+"help > Reportar Bug :)`",
                  "url": "https://discord.gg/tPWYAPhhwz",
                  "color": 9215,
                  "footer": {
                    "text": "Apolo Security"
                  },
                  "timestamp": Date.now()
                }
            ]
        });
        msg.react('⚙');
        msg.react('❔');
        msg.react('❌');
        const rFilter = (r, user) => {
            return ['⚙', '❔', '❌'].includes(r.emoji.name) && user.id === message.author.id;
        }
        const collected = await msg.awaitReactions({ filter: rFilter, max: 1, time: 120000 });
        const reaction = collected.first().emoji.name;
        if(reaction === "⚙") {
            let ms = await msg.edit({
                "embeds": [
                    {
                      "title": "`📚` - Configuración Anti-Maliciosos",
                      "description": "`{🔨}` **|** `A continuación elige la sanción que dare al entrar un usuario malicioso.`\n\n:one: **> **`Marcar` **|** :two: **>** `Expulsar` **|** :three: **>** `Banear`",
                      "url": "https://discord.gg/tPWYAPhhwz",
                      "color": 9215,
                      "footer": {
                        "text": "Apolo Security"
                      },
                      "timestamp": Date.now()
                    }
                ]                
            });
            await msg.reactions.removeAll();
            ms.react('1️⃣');
            ms.react('2️⃣');
            ms.react('3️⃣');
            const rFilter2 = (r, user) => {
                return ['1️⃣', '2️⃣', '3️⃣'].includes(r.emoji.name) && user.id === message.author.id;
            }
            const co = await ms.awaitReactions({ filter: rFilter2, max: 1, time: 120000 });
            const r = co.first().emoji.name;
            let Sancion;
            if(r === "1️⃣") {
                Sancion = "Marcar"
            } else if(r === "2️⃣") {
                Sancion = "Expulsar"
            } else if(r === "3️⃣") {
                Sancion = "Banear"
            }
            thisGuild.punishment = Sancion;
            await thisGuild.save();
            await ms.reactions.removeAll();
            ms.edit({
                "embeds": [
                    {
                      "title": "`📚` - Configuración Anti-Maliciosos",
                      "description": "`✅` **|** ¡__Excelente tu configuración fue guardada correctamente__!, ahora los usuarios tendrán el castigo de: __`"+Sancion+"`__\n\n`❌` **|** Para desactivar el anti-maliciosos utiliza `"+prefix+"anti-malicious`",
                      "url": "https://discord.gg/tPWYAPhhwz",
                      "color": 9215,
                      "footer": {
                        "text": "Apolo Security"
                      },
                      "timestamp": Date.now()
                    }
                  ]
            });
        } else if(reaction === "❔") {
            msg.reactions.removeAll();
            msg.edit({
                "embeds": [
                    {
                      "title": "`📚` - Configuración Anti-Maliciosos",
                      "description": "`{❌}` **|** Para desactivar el anti-maliciosos utiliza `ap!anti-malicious`",
                      "url": "https://discord.gg/tPWYAPhhwz",
                      "color": 9215,
                      "fields": [
                        {
                          "name": "🔨 `|` Sanción al entrar:",
                          "value": "Al entrar un usuario malicioso: `"+thisGuild?.punishment+"`"
                        },
                        {
                          "name": "👤 `|` Last Malicious Entry",
                          "value": "La ultima entrada de un malicioso registrada es: `"+thisGuild?.lastMaliciousDetected+"`"
                        }
                      ],
                      "footer": {
                        "text": "Apolo Security"
                      },
                      "timestamp": Date.now()
                    }
                  ]
            });
        } else if(reaction === "❌") {
            msg.reactions.removeAll();
            msg.edit({
                "embeds": [
                    {
                      "title": "`📚` - Configuración Anti-Maliciosos",
                      "description": "`❌` **|** `Comando cancelado correctamente!`",
                      "url": "https://discord.gg/tPWYAPhhwz",
                      "color": 9215,
                      "footer": {
                        "text": "Apolo Security"
                      },
                      "timestamp": Date.now
                    }
                ]
            });
        }
    }
}