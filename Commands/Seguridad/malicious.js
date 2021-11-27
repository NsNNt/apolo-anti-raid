const { MessageEmbed, MessageActionRow, Message, MessageButton } = require("discord.js");
const Malicious = require("../../Models/Malicious");
const emojis = require("../../emojis");

module.exports = {
    name: "anti-malicious",
    aliases: ["antimalicious"],
    description: "Activa el anti-maliciosos en tu servidor",
    usage: "anti-malicious",
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
            let msg = await message.channel.send(
                {
                    "embeds": [
                        {
                          "title": "Información",
                          "description": "> `❔` **|** `¿Quieres activar el sistema anti-maliciosos?`\n\n`{✅}` - `Activarlo`\n`{❌}` - `Cancelar`",
                          "url": "https://discord.gg/tPWYAPhhwz",
                          "color": 9215,
                          "footer": {
                            "text": "Apolo Security"
                          },
                          "timestamp": Date.now()
                        }
                    ]
                }
            ); // Embed
            msg.react('✅');
            msg.react('❌');
            const rFilter = (r, user) => {
                return ['✅', '❌'].includes(r.emoji.name) && user.id === message.author.id;
            }
            const collected = await msg.awaitReactions({ filter: rFilter, max: 1, time: 120000 });
            const reaction = collected.first().emoji.name;
            if(reaction === "✅") {
                    const nM = new Malicious({
                        guildId: message.guild.id,
                        punishment: "Marcar",
                        lastMaliciousDetected: "Nadie.",
                        actived: true
                    });
                    await nM.save();
                    msg.edit({
                        "embeds": [
                            {
                              "title": "Información",
                              "description": "> `🛡` **|** `Ok, he activado el sistema anti-maliciosos`\n\n`{📰}` - Para configurarlo utiliza __`"+prefix+"anti-malicious-config`__\n`{❌}` - Para desactivarlo utiliza __`"+prefix+"anti-malicious`__\n\n*Nota:* Este sistema esta en `BETA`, es como se veran las proximas actualizaciones de estos sistemas :)",
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
            } else if(reaction === "❌") {
                msg.edit({
                    "embeds": [
                        {
                          "title": "Información",
                          "description": ">  `🛑` **|** `Ok, he cancelado el comando anti-maliciosos.`\n\n`{✅}` - Para activarlo utiliza de nuevo el comando `"+prefix+"anti-malicious`\n`{📚}` - Este sistema te protege de usuarios maliciosos `marcandolos`, `expulsandolos` o `baneandolos.`",
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

            }
        } else if(thisGuild?.actived) {
            let msg = await message.channel.send(
                {
                    "embeds": [
                        {
                          "title": "Información",
                          "description": "> `❔` **|** `¿Quieres desactivar el sistema anti-maliciosos?`\n\n`{✅}` - `Desactivarlo`\n`{❌}` - `Cancelar`",
                          "url": "https://discord.gg/tPWYAPhhwz",
                          "color": 9215,
                          "footer": {
                            "text": "Apolo Security"
                          },
                          "timestamp": Date.now()
                        }
                    ]
                }
            ); // Embed
            msg.react('✅');
            msg.react('❌');
            const rFilter = (r, user) => {
                return ['✅', '❌'].includes(r.emoji.name) && user.id === message.author.id;
            }
            const collected = await msg.awaitReactions({ filter: rFilter, max: 1, time: 120000, errors: ['time'] });
            const reaction = collected.first().emoji.name;
            if(reaction === "✅") {
                    thisGuild.actived = false;
                    await thisGuild.save();
                    msg.edit({
                        "embeds": [
                            {
                              "title": "Información",
                              "description": "> `🛡` **|** `Ok, he desactivado el sistema anti-maliciosos`\n\n`{✅}` - Para activarlo utiliza __`"+prefix+"anti-malicious`__\n\n*Nota:* Este sistema esta en `BETA`, es como se veran las proximas actualizaciones de estos sistemas :)",
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
            } else if(reaction === "❌") {
                msg.edit({
                    "embeds": [
                        {
                          "title": "Información",
                          "description": ">  `🛑` **|** `Ok, he cancelado el comando anti-maliciosos.`\n\n`{❌}` - Para desactivarlo utiliza de nuevo el comando `"+prefix+"anti-malicious`\n`{📚}` - Este sistema te protege de usuarios maliciosos `marcandolos`, `expulsandolos` o `baneandolos.`",
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
            }
        } else {
            let msg = await message.channel.send(
                {
                    "embeds": [
                        {
                          "title": "Información",
                          "description": "> `❔` **|** `¿Quieres activar el sistema anti-maliciosos?`\n\n`{✅}` - `Activarlo`\n`{❌}` - `Cancelar`",
                          "url": "https://discord.gg/tPWYAPhhwz",
                          "color": 9215,
                          "footer": {
                            "text": "Apolo Security"
                          },
                          "timestamp": Date.now()
                        }
                    ]
                }
            ); // Embed
            msg.react('✅');
            msg.react('❌');
            const rFilter = (r, user) => {
                return ['✅', '❌'].includes(r.emoji.name) && user.id === message.author.id;
            }
            const collected = await msg.awaitReactions({ filter: rFilter, max: 1, time: 120000 });
            const reaction = collected.first().emoji.name;
            if(reaction === "✅") {
                    thisGuild.actived = true;
                    await thisGuild.save();
                    msg.edit({
                        "embeds": [
                            {
                              "title": "Información",
                              "description": "> `🛡` **|** `Ok, he activado el sistema anti-maliciosos`\n\n`{📰}` - Para configurarlo utiliza __`"+prefix+"anti-malicious-config`__\n`{❌}` - Para desactivarlo utiliza __`"+prefix+"anti-malicious`__\n\n*Nota:* Este sistema esta en `BETA`, es como se veran las proximas actualizaciones de estos sistemas :)",
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
            } else if(reaction === "❌") {
                msg.edit({
                    "embeds": [
                        {
                          "title": "Información",
                          "description": ">  `🛑` **|** `Ok, he cancelado el comando anti-maliciosos.`\n\n`{✅}` - Para activarlo utiliza de nuevo el comando `"+prefix+"anti-malicious`\n`{📚}` - Este sistema te protege de usuarios maliciosos `marcandolos`, `expulsandolos` o `baneandolos.`",
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

            }
        }
    }
}