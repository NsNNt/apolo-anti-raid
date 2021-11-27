const { MessageEmbed, MessageActionRow, Message, MessageButton, MessageSelectMenu } = require("discord.js");
const emojis = require("../../emojis");

module.exports = {
    name: "help",
    aliases: ["ayuda"],
    description: "Comando de ayuda para empezar",
    cooldown: 3,
    /**
     * @param {Message} message
     */
    async execute(message, args, commandName, client, Discord, prefix) {
        const row = new MessageActionRow()
        .addComponents(
            new MessageSelectMenu()
            .setPlaceholder('¿Qué ayuda necesitas?')
            .setMaxValues(1)
            .setCustomId("ap_slch")
            .addOptions(
                [
                    {
                        label: "Servidor de soporte",
                        description: "Mi servidor de Soporte",
                        emoji: "🦺",
                        value: "ap_sdsp"
                    },
                    {
                        label: "Queja",
                        description: "Envía una queja de el bot al staff",
                        emoji: "📫",
                        value: "ap_qja"
                    },
                    {
                        label: "Reportar Bug",
                        description: "Envía un reporte de bug al staff",
                        emoji: "🚧",
                        value: "ap_rptrbg"
                    },
                    {
                        label: "¿Qué es Apolo?",
                        description: "Información útil acerca de apolo",
                        emoji: "🔎",
                        value: "ap_qeap"
                    },
                    {
                        label: "¿Cómo configuro Apolo?",
                        description: "Información útil de como configurarme",
                        emoji: "📚",
                        value: "ap_ccap"
                    }
                ]
            )
        )
        const m = await message.channel.send({
            "content": null,
            "embeds": [
              {
                "title": "Comando de ayuda.",
                "description": "`🦺` - `Servidor de soporte` **(Mi soporte)**\n——————————————————————\n`📫` - `Queja` **(Envía una queja al staff)**\n——————————————————————\n`🚧` - `Reportar Bug` **(Envía un reporte de bug al staff)**\n——————————————————————\n`🔎` - `¿Qué es Apolo?` **(Información útil de Apolo)**\n——————————————————————\n`📚` - `¿Cómo configuro Apolo?` **(Información útil de mi configuración)**\n——————————————————————",
                "color": 50943,
                "fields": [
                  {
                    "name": "⛓️ | Enlaces útiles:",
                    "value": "[[Click aqui para invitarme]](https://discordbotlist.com/bots/apolo)\n[[Click aquí para votar por mí]](https://discordbotlist.com/bots/apolo/upvote)",
                    "inline": true
                  },
                  {
                    "name": "🎫 | Soporte",
                    "value": "[[Click aquí para ir a mi servidor]](https://discord.gg/tPWYAPhhwz)",
                    "inline": true
                  },
                  {
                      "name": "📂 | Comandos útiles:",
                      "value": `\`${prefix}commands\` - \`${prefix}invite\``
                  }
                ],
                "author": {
                  "name": `${message.author.tag}`,
                  "icon_url": `${message.author.displayAvatarURL({ dynamic: true })}`
                },
                "footer": {
                  "text": "Selecciona una con el submenu",
                  "icon_url": client.user.avatarURL({ dynamic: true })
                },
                "image": {
                  "url": "https://cdn.discordapp.com/attachments/904118196267802665/907021188822343730/unknown.png"
                }
              }
            ],
            components: [row]
          });
          const ifilter = (m) => m.user.id === message.author.id;
          const select = m.createMessageComponentCollector({ filter: ifilter });
          select.on('collect', async i => {
            if(i.values[0] === "ap_sdsp") {
                // Servidor de soporte
                await i.reply({ 
                    content: null, 
                    "embeds": [
                        {
                        "title": "[Click aquí para ir al servidor de soporte]",
                        "description": "**¿Qué ofrecemos?**\n`-` **|** Soporte 24/7.\n`-` **|** Sistema de reportes de usuarios peligrosos.\n`-` **|**  Staff conectado.\n——————————————————————\n**Gracias por usar __Apolo__.**",
                        "url": "https://discord.gg/tPWYAPhhwz",
                        "color": 50943,
                        "thumbnail": {
                            "url": client.user.avatarURL({ dynamic: true })
                        }
                    }
                ], 
                  ephemeral: true 
                });
            } else if(i.values[0] === "ap_qja") {
                // Queja
                await i.reply({ 
                    content: null,
                    "embeds": [
                        {
                          "title": "Proporcionar una queja",
                          "description": "**-** **|** `Escribe despues de este mensaje que queja tienes.`\n\n**`-` Este modulo es serio, por favor no juege con las quejas o sera sancionado.**\n**`-` También puede proporcionar una queja en nuestro servidor de soporte.**",
                          "url": "https://discord.gg/tPWYAPhhwz",
                          "color": 50943,
                          "thumbnail": {
                            "url": client.user.avatarURL({ dynamic: true })
                          }
                        }
                      ],
                    ephemeral: true 
                });
                const clq = await message.channel.awaitMessages({ filter: (m) => m.author.id === message.author.id, max: 1, time: 120000, errors: ['time'] }).catch(async e => { 
                    return await i.editReply({ content: "Se agoto el tiempo de espera para enviar el bug.", embeds: [] }); 
                });
                const queja = clq.first().content;
                if(queja.length < 10) {
                    await i.editReply({ content: "No puedo enviar esta queja, el contenido debe ser mayor a 10 caracteres.", embeds: [] });
                } else {
                    const cl = await client.channels.cache.get("907032250145714216");
                    cl.send({ content: `Nueva queja por parte del usuario: \`${message.author.tag} | ID: ${message.author.id}\`\nQueja: \`\`\`${queja}\`\`\`` });
                    await i.editReply({ content: "Queja enviada al soporte correctamente.", embeds: [], ephemeral: true })
                }
            } else if(i.values[0] === "ap_rptrbg") {
                // Reportar Bug
                await i.reply({ 
                    "content": null,
                    "embeds": [
                        {
                        "title": "Reportar Bug de Apolo",
                        "description": "`-` **|** Escribe después de este mensaje el __bug encontrado.__\n\n`[?]` **|** Por favor que tu mensaje sea mayor a 30 caracteres.\n`[?]` **|** Proporciona también el comando en el que lo encontraste.\n`[!]` **|** Este modulo es serio, por favor no uses este comando de juego o seras sancionado.",
                        "url": "https://discord.gg/tPWYAPhhwz",
                        "color": 50943,
                        "thumbnail": {
                            "url": client.user.avatarURL({ dynamic: true })
                        }
                        }
                    ],
                    ephemeral: true 
                });
                const bc = await message.channel.awaitMessages({ filter: (m) => m.author.id === message.author.id, max: 1, time: 120000, errors: ['time'] }).catch(async e => {
                    return await i.editReply({ content: "Se agoto el tiempo de espera para enviar el bug.", embeds: [] });
                });
                const bug = bc.first().content;
                if(bug.length < 30) {
                    await i.editReply({ content: "No puedo enviar este reporte, porfavor asegurate de que el contenido sea mayor a 30 caracteres.", embeds: [] })
                } else {
                    const cl = await client.channels.cache.get("907034930431811615")
                    cl.send({ content: `Nuevo bug, reportado por: \`${message.author.tag} | ID: ${message.author.id}\`\nBUG: \`\`\`${bug}\`\`\`` });
                    await i.editReply({ content: "Reporte enviado correctamente al staff!", embeds: [] });
                }
            } else if(i.values[0] === "ap_qeap") {
                // Que es apolo
                await i.reply({ 
                    content: null,
                    "embeds": [
                        {
                          "title": "| ¿Qué es Apolo?",
                          "description": "`(1)` **|** Apolo es un bot dedicado a la protección y administración de servidores, es un bot potente y uno de los mejores bots para `anti-raid`.\n\n**|** **¿Cómo veo las estadísticas de mi servidor?**\n`(2)` **|** Para ver las estadísticas de tu servidor y usa el comando `status`, te indicara los módulos que tienes activados y unos consejos para configurar mejor tu servidor.\n\n**| ¿Qué tiene de diferente de otros bots?**\n`(3)` **|** Su fácil y simple configuración para tu servidor, así como una protección excelente.",
                          "color": 50943,
                          "thumbnail": {
                            "url": client.user.avatarURL({ dynamic: true })
                          }
                        }
                      ],
                    ephemeral: true 
                })
            } else if(i.values[0] === "ap_ccap") {
                // Como configurar apolo
                await i.reply({ 
                    content: null,
                    "embeds": [
                        {
                          "title": "Ayuda para configurarme.",
                          "description": "`(1)` **|** El rol de __Apolo__ debe estar en lo más alto de los roles para poder ejecutar bien el `anti-raid` y parar todos los raids, de lo contrario no podra parar la mayoria de raids.\n\n`(2)` **|** Para `automoderar` tu servidor siempre puedes activar el `auto-moderador` y configurarlo con `auto-moderador-config`, te protegera de flood, spam (links discord) y muchas cosas más.\n\n`(3)` **|** Para prevenir ataques de `tokens/multicuentas` activa el `anti-tokens`, esto te protegera de `tokens/multicuentas/selfbots`.\n\n`(4)` **|** Para prevenir que los usuarios añadan bots a tu servidor activa `anti-bots`, esto te protegera de los bots que __no estan verificados.__",
                          "color": 50943,
                          "author": {
                            "name": "nsnt#5891",
                            "icon_url": client.user.avatarURL({ dynamic: true })
                          },
                          "footer": {
                            "text": `Proteccion de ${message.guild.name}`,
                            "icon_url": client.user.avatarURL({ dynamic: true })
                          }
                        }
                      ], 
                    ephemeral: true 
                });
            }
          });
    }
}