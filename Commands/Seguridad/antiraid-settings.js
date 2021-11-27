const { MessageEmbed, MessageActionRow, Message, MessageButton, MessageSelectMenu } = require("discord.js");
const AntiRaid = require("../../Models/AntiRaid");
const emojis = require("../../emojis");

module.exports = {
    name: "antiraid-settings",
    aliases: ["anti-raid-settings", "antiraid-config", "anti-raid-config"],
    description: "Establece tu configuración de antiraid para el servidor",
    cooldown: 5,
    permissions: "OWNER",
    /**
     * @param {Message} message
     */
    async execute(message, args, commandName, client, Discord, prefix) {
        if(message.guild.ownerId !== message.author.id) {
            return message.reply({ content: `Solo el __propietario__ de este servidor puede usar esto`, allowedMentions: { repliedUser: false } });
        } else {
            const Embed = new MessageEmbed()
            .setTitle("Información")
            .setDescription(`${emojis.cargando} | \`Obteniendo configuraciones de tu servidor\``)
            .setColor("BLUE")
            .setFooter(message.guild.name)
            .setTimestamp()

            let msg = await message.channel.send({ embeds: [Embed] });
            const antiraid = await AntiRaid.findOne({ guildId: message.guild.id });
            if(!antiraid) {
                const ErrResponse = new MessageEmbed()
                .setTitle("Información")
                .setDescription(`${emojis.negativo} | \`El Anti-Raid esta desactivado en este servidor.\``)
                .setColor("RED")
                .setFooter(message.guild.name)
                .setTimestamp()
                msg.edit({ embeds: [ErrResponse] });
            } else {
                if(!antiraid?.actived) {
                    const ErrResponse = new MessageEmbed()
                    .setTitle("Información")
                    .setDescription(`${emojis.negativo} | \`El Anti-Raid esta desactivado en este servidor.\``)
                    .setColor("RED")
                    .setFooter(message.guild.name)
                    .setTimestamp()
                    msg.edit({ embeds: [ErrResponse] });
                } else {
                    const row = new MessageActionRow()
                    .addComponents(
                        new MessageSelectMenu()
                        .setMaxValues(1)
                        .setCustomId('ap_sl')
                        .addOptions(
                            [
                                {
                                    label: "Sanción",
                                    value: "ap_s",
                                    description: "Cambia la sanción por sobrepasar los limites.",
                                    emoji: "🔨"
                                },
                                {
                                    label: "Canales",
                                    value: "ap_mcls",
                                    description: "Cambia los limites de la creación y eliminación de canales.",
                                    emoji: "💬"
                                },
                                {
                                    label: "Penitencias",
                                    value: "ap_pnts",
                                    description: "Cambia los limites de expulsar y banear usuarios",
                                    emoji: "📌"
                                },
                                {
                                    label: "Roles",
                                    value: "ap_mxrls",
                                    description: "Cambia los limites de la creación y eliminación de roles",
                                    emoji: "📂"
                                },
                                {
                                  	label: "Mensajes de Webhooks",
                                   	value: "ap_mxmw",
                                    description: "Cambia el limite de mensajes de un webhook en 7s",
                                    emoji: "🤖"
                                },
                                {
                                    label: "Limpiar",
                                    description: "Borra tu selección",
                                    emoji: "🗑",
                                    value: "ap_ret"
                                }
                            ]
                        )
                    )
                    const Response = new MessageEmbed()
                    .setTitle(`Configuraciones Anti-Raid:`)
                    .setDescription(`${emojis.escudo} | Para configurar las opciones usa la barra de selección.`)
                    .addField("🔨 | Sanción", `> Sanción por sobrepasar limite: \`${antiraid?.sancionType}\``)
                    .addField(`💬 | Máximos canales`, `> Limite de creación: \`${antiraid?.maxChannelsCreate}\`\n> Limite de eliminación: \`${antiraid?.maxChannelsDelete}\``)
                    .addField(`📌 | Máximas penitencias`, `> Limite de expulsiones: \`${antiraid?.maxKickNumber}\`\n> Limite de baneos: \`${antiraid?.maxBansNumber}\``)
                    .addField(`📂 | Máximos roles`, `> Limite de creación: \`${antiraid?.maxRolesCreate}\`\n> Limite de eliminación: \`${antiraid?.maxRolesDelete}\``)
                    .addField(`🤖 | Mensajes de webhooks`, `> Limite de mensajes: \`${antiraid?.maxWebhookMessages}\``)
                    .setFooter(message.guild.name)
                    .setTimestamp()
                    .setColor("BLUE")
                    const m = await msg.edit({ embeds: [Response], components: [row] });
                    const ifilter = (i) => i.user.id === message.author.id;
                    const colector = m.createMessageComponentCollector({ filter: ifilter, time: 60000 });
                    colector.on('collect', async i => {
                        if(i.values[0] === "ap_mxmw") {
                            await i.deferUpdate();
                            const a_x5000 = new MessageEmbed()
                            .setTitle("Información")
                            .setDescription(`${emojis.cargando} | Escribe el número de mensajes que podra enviar un webhook en 7s.`)
                            .setColor("BLUE")
                            .setFooter(message.guild.name)
                            .setTimestamp()
                            let fx0233 = await message.channel.send({ embeds: [a_x5000] });
                            const colect = await message.channel.awaitMessages({ filter: (m) => m.author.id === message.author.id, max: 1 });
                          	const numero = colect.first().content;
                            if(isNaN(numero)) {
                                return message.channel.send({ content: "Eso no es un número." })
                            } else {
                                antiraid.maxWebhookMessages = numero;
                                await antiraid.save();
                                const a_x3001 = new MessageEmbed()
                                .setTitle("Información")
                                .setDescription(`${emojis.positivo} | \`Configuración guardada correctamente.\``)
                                .setColor("BLUE")
                                .setFooter(message.guild.name)
                                .setTimestamp()
                                fx0233.edit({ embeds: [a_x3001] });
                            }
                        } else if(i.values[0] === "ap_s") {
                            await i.deferUpdate();
                            const a_x3000 = new MessageEmbed()
                            .setTitle("Información")
                            .setDescription(`${emojis.cargando} | Escribe una sanción para guardar: \`ban\`, \`kick\``)
                            .setColor("BLUE")
                            .setFooter(message.guild.name)
                            .setTimestamp()
                            let fx0233 = await message.channel.send({ embeds: [a_x3000] });
                            const colect = await message.channel.awaitMessages({ filter: (m) => m.author.id === message.author.id, max: 1 });
                            const sancion = colect.first().content;
                            if(sancion.toLowerCase() !== "ban" && sancion.toLowerCase() !== "kick") {
                                return message.channel.send({ content: "Esa acción no esta disponible." });
                            } else {
                                antiraid.sancionType = sancion.toLowerCase();
                                await antiraid.save();
                                const a_x3001 = new MessageEmbed()
                                .setTitle("Información")
                                .setDescription(`${emojis.positivo} | \`Configuración guardada correctamente.\``)
                                .setColor("BLUE")
                                .setFooter(message.guild.name)
                                .setTimestamp()
                                fx0233.edit({ embeds: [a_x3001] });
                            }
                        } else if(i.values[0] === "ap_mcls") {
                            await i.deferUpdate();
                            const a_x3000 = new MessageEmbed()
                            .setTitle("Información")
                            .setDescription(`${emojis.cargando} | Escribe el modulo para editar: \`creacion\`, \`eliminacion\``)
                            .setColor("BLUE")
                            .setFooter(message.guild.name)
                            .setTimestamp()
                            let fx0233 = await message.channel.send({ embeds: [a_x3000] });
                            const colect = await message.channel.awaitMessages({ filter: (m) => m.author.id === message.author.id, max: 1 });
                            const modulo = colect.first().content;
                            if(modulo.toLowerCase() !== "creacion" && modulo.toLowerCase() !== "eliminacion") {
                                return message.channel.send({ content: "Ese modulo no esta disponible" });
                            } else {
                                if(modulo === "creacion") {
                                    const a_x3004 = new MessageEmbed()
                                    .setTitle("Información")
                                    .setDescription(`${emojis.cargando} | \`Escribe el limite de canales que un usuario podra crear\``)
                                    .setColor("BLUE")
                                    .setFooter(message.guild.name)
                                    .setTimestamp()
                                    fx0233.edit({ embeds: [a_x3004] });
                                    const colect = await message.channel.awaitMessages({ filter: (m) => m.author.id === message.author.id, max: 1 });
                                    const numero = colect.first().content;
                                    if(isNaN(numero)) {
                                        return message.channel.send({ content: "Eso no es un numero." })
                                    } else {
                                        if(numero <= 0) {
                                            return message.channel.send({ content: "La cantidad no puede ser menor a 0." })
                                        }
                                        antiraid.maxChannelsCreate = numero;
                                        await antiraid.save();
                                        const a_x3005 = new MessageEmbed()
                                        .setTitle("Información")
                                        .setDescription(`${emojis.positivo} | \`Configuración guardada correctamente.\``)
                                        .setColor("BLUE")
                                        .setFooter(message.guild.name)
                                        .setTimestamp()
                                        fx0233.edit({ embeds: [a_x3005] });
                                    }
                                } else if(modulo === "eliminacion") {
                                    
                                    const a_x3004 = new MessageEmbed()
                                    .setTitle("Información")
                                    .setDescription(`${emojis.cargando} | \`Escribe el limite de canales que un usuario podra eliminar\``)
                                    .setColor("BLUE")
                                    .setFooter(message.guild.name)
                                    .setTimestamp()
                                    fx0233.edit({ embeds: [a_x3004] });
                                    const colect = await message.channel.awaitMessages({ filter: (m) => m.author.id === message.author.id, max: 1 });
                                    const numero = colect.first().content;
                                    if(isNaN(numero)) {
                                        return message.channel.send({ content: "Eso no es un numero." })
                                    } else {
                                        if(numero <= 0) {
                                            return message.channel.send({ content: "La cantidad no puede ser menor a 0." })
                                        }
                                        antiraid.maxChannelsDelete = numero;
                                        await antiraid.save();
                                        const a_x3005 = new MessageEmbed()
                                        .setTitle("Información")
                                        .setDescription(`${emojis.positivo} | \`Configuración guardada correctamente.\``)
                                        .setColor("BLUE")
                                        .setFooter(message.guild.name)
                                        .setTimestamp()
                                        fx0233.edit({ embeds: [a_x3005] });
                                    }
                                }
                            }
                        } else if(i.values[0] === "ap_pnts") {
                            await i.deferUpdate();
                            const a_x3000 = new MessageEmbed()
                            .setTitle("Información")
                            .setDescription(`${emojis.cargando} | Escribe una penitencia para configurar: \`ban\`, \`kick\``)
                            .setColor("BLUE")
                            .setFooter(message.guild.name)
                            .setTimestamp()
                            let fx0233 = await message.channel.send({ embeds: [a_x3000] });
                            const colect = await message.channel.awaitMessages({ filter: (m) => m.author.id === message.author.id, max: 1 });
                            const penitencia = colect.first().content;
                            if(penitencia !== "ban" && penitencia !== "kick") {
                                return message.channel.send({ content: "Esa penitencia no esta disponible." });
                            } else {
                                if(penitencia === "ban") {
                                    const a_x3004 = new MessageEmbed()
                                    .setTitle("Información")
                                    .setDescription(`${emojis.cargando} | \`Escribe el limite de baneos que un usuario podra hacer\``)
                                    .setColor("BLUE")
                                    .setFooter(message.guild.name)
                                    .setTimestamp()
                                    fx0233.edit({ embeds: [a_x3004] });
                                    const colect = await message.channel.awaitMessages({ filter: (m) => m.author.id === message.author.id, max: 1 });
                                    const numero = colect.first().content;
                                    if(isNaN(numero)) {
                                        return message.channel.send({ content: "Eso no es un numero." })
                                    } else {
                                        if(numero <= 0) {
                                            return message.channel.send({ content: "La cantidad no puede ser menor a 0." })
                                        }
                                        antiraid.maxBansNumber = numero;
                                        await antiraid.save();
                                        const a_x3005 = new MessageEmbed()
                                        .setTitle("Información")
                                        .setDescription(`${emojis.positivo} | \`Configuración guardada correctamente.\``)
                                        .setColor("BLUE")
                                        .setFooter(message.guild.name)
                                        .setTimestamp()
                                        fx0233.edit({ embeds: [a_x3005] });
                                    }
                                } else if(penitencia === "kick") {
                                    const a_x3004 = new MessageEmbed()
                                    .setTitle("Información")
                                    .setDescription(`${emojis.cargando} | \`Escribe el limite de expulsiones que un usuario podra hacer\``)
                                    .setColor("BLUE")
                                    .setFooter(message.guild.name)
                                    .setTimestamp()
                                    fx0233.edit({ embeds: [a_x3004] });
                                    const colect = await message.channel.awaitMessages({ filter: (m) => m.author.id === message.author.id, max: 1 });
                                    const numero = colect.first().content;
                                    if(isNaN(numero)) {
                                        return message.channel.send({ content: "Eso no es un numero." })
                                    } else {
                                        if(numero <= 0) {
                                            return message.channel.send({ content: "La cantidad no puede ser menor a 0." })
                                        }
                                        antiraid.maxKickNumber = numero;
                                        await antiraid.save();
                                        const a_x3005 = new MessageEmbed()
                                        .setTitle("Información")
                                        .setDescription(`${emojis.positivo} | \`Configuración guardada correctamente.\``)
                                        .setColor("BLUE")
                                        .setFooter(message.guild.name)
                                        .setTimestamp()
                                        fx0233.edit({ embeds: [a_x3005] });
                                    }
                                }
                            }
                        } else if(i.values[0] === "ap_mxrls") {
                            await i.deferUpdate();
                            const a_x3000 = new MessageEmbed()
                            .setTitle("Información")
                            .setDescription(`${emojis.cargando} | Escribe el modulo para editar: \`creacion\`, \`eliminacion\``)
                            .setColor("BLUE")
                            .setFooter(message.guild.name)
                            .setTimestamp()
                            let fx0233 = await message.channel.send({ embeds: [a_x3000] });
                            const colect = await message.channel.awaitMessages({ filter: (m) => m.author.id === message.author.id, max: 1 });
                            const modulo = colect.first().content;
                            if(modulo.toLowerCase() !== "creacion" && modulo.toLowerCase() !== "eliminacion") {
                                return message.channel.send({ content: "Ese modulo no esta disponible" });
                            } else {
                                if(modulo === "creacion") {
                                    const a_x3004 = new MessageEmbed()
                                    .setTitle("Información")
                                    .setDescription(`${emojis.cargando} | \`Escribe el limite de roles que un usuario podra crear\``)
                                    .setColor("BLUE")
                                    .setFooter(message.guild.name)
                                    .setTimestamp()
                                    fx0233.edit({ embeds: [a_x3004] });
                                    const colect = await message.channel.awaitMessages({ filter: (m) => m.author.id === message.author.id, max: 1 });
                                    const numero = colect.first().content;
                                    if(isNaN(numero)) {
                                        return message.channel.send({ content: "Eso no es un numero." })
                                    } else {
                                        if(numero <= 0) {
                                            return message.channel.send({ content: "La cantidad no puede ser menor a 0." })
                                        }
                                        antiraid.maxRolesCreate = numero;
                                        await antiraid.save();
                                        const a_x3005 = new MessageEmbed()
                                        .setTitle("Información")
                                        .setDescription(`${emojis.positivo} | \`Configuración guardada correctamente.\``)
                                        .setColor("BLUE")
                                        .setFooter(message.guild.name)
                                        .setTimestamp()
                                        fx0233.edit({ embeds: [a_x3005] });
                                    }
                                } else if(modulo === "eliminacion") {
                                    
                                    const a_x3004 = new MessageEmbed()
                                    .setTitle("Información")
                                    .setDescription(`${emojis.cargando} | \`Escribe el limite de roles que un usuario podra eliminar\``)
                                    .setColor("BLUE")
                                    .setFooter(message.guild.name)
                                    .setTimestamp()
                                    fx0233.edit({ embeds: [a_x3004] });
                                    const colect = await message.channel.awaitMessages({ filter: (m) => m.author.id === message.author.id, max: 1 });
                                    const numero = colect.first().content;
                                    if(isNaN(numero)) {
                                        return message.channel.send({ content: "Eso no es un numero." })
                                    } else {
                                        if(numero <= 0) {
                                            return message.channel.send({ content: "La cantidad no puede ser menor a 0." })
                                        }
                                        antiraid.maxRolesDelete = numero;
                                        await antiraid.save();
                                        const a_x3005 = new MessageEmbed()
                                        .setTitle("Información")
                                        .setDescription(`${emojis.positivo} | \`Configuración guardada correctamente.\``)
                                        .setColor("BLUE")
                                        .setFooter(message.guild.name)
                                        .setTimestamp()
                                        fx0233.edit({ embeds: [a_x3005] });
                                    }
                                }
                            }
                        } else if(i.values[0] === "ap_ret") {
                            await i.deferUpdate();
                        }
                    });
                }
            }
        }
    }
}