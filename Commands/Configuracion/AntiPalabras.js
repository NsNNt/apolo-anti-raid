const { MessageEmbed, MessageActionRow, Message, MessageButton } = require("discord.js");
const AntiPalabras = require("../../Models/AntiPalabras");
const emojis = require("../../emojis");

module.exports = {
    name: "antipalabras",
    aliases: ["anti-palabras"],
    description: "Los usuarios no podran decir las frases que esten en esta lista",
    permissions: "MANAGE_GUILD",
    cooldown: 2,
    /**
     * @param {Message} message
     * @param {MessageButton} MessageButton
     */
    async execute(message, args, commandName, client, Discord, prefix) {
        if(!message.member.permissions.has("MANAGE_GUILD")) {
            return message.reply({ content: `${emojis.negativo} | \`No tienes permisos para ejecutar esta acción\` `, allowedMentions: { repliedUser: false } });
        } else {
            if(!message.guild.me.permissions.has("ADMINISTRATOR")) {
                return message.reply({ content: `No puedo interactuar con este servidor sin los siguientes permisos: \`ADMINISTRADOR\``, allowedMentions: { repliedUser: false } });
            }
            const Palabras = await AntiPalabras.findOne({ guildId: message.guild.id });
            if(!Palabras) {
                const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                    .setCustomId('si')
                    .setStyle('SUCCESS')
                    .setLabel('Continuar')
                    .setEmoji(`${emojis.positivo}`),

                    new MessageButton()
                    .setCustomId('no')
                    .setStyle('DANGER')
                    .setLabel('Cancelar')
                    .setEmoji(`${emojis.negativo}`)
                )
                const Embed = new MessageEmbed()
                .setDescription(`${emojis.escudo} | \`¿Estas seguro de activar el antipalabras en este servidor?\``)
                .setColor("BLUE")
                .setTimestamp()
                let confirmacion = await message.reply({ embeds: [Embed], components: [row], allowedMentions: { repliedUser: false } });
                const filter = i => i.user.id === message.author.id;
                const colector = confirmacion.createMessageComponentCollector({ filter: filter, time: 20000 });
                colector.on('collect', async i => {
                    if(i.customId === "si") {
                        const createAntiPalabras = new AntiPalabras({
                            guildId: message.guild.id,
                            actived: true,
                            palabras: []
                        });
                        const Response = new MessageEmbed()
                        .setDescription(`${emojis.positivo} | \`Entendido, he activado el antipalabras, para configurarlo usa de nuevo ${prefix}antipalabras\``)
                        .setColor("BLUE")
                        .setTimestamp()
                        await createAntiPalabras.save();
                        await i.deferUpdate();
                        await i.editReply({ embeds: [Response], components: [], allowedMentions: { repliedUser: false } });
                    } else if(i.customId === "no") {
                        const Response = new MessageEmbed()
                        .setDescription(`${emojis.positivo} | \`Entendido, he cancelado el comando\``)
                        .setColor("BLUE")
                        .setTimestamp()
                        await i.deferUpdate();
                        await i.editReply({ embeds: [Response], components: [], allowedMentions: { repliedUser: false } });
                    }
                });
            } else {
                if(Palabras.actived) {
                    const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                    .setCustomId('nueva')
                    .setStyle("PRIMARY")
                    .setEmoji(`${emojis.nueva}`),

                    new MessageButton()
                    .setCustomId('remover')
                    .setStyle("PRIMARY")
                    .setEmoji(`${emojis.remover}`),

                    new MessageButton()
                    .setCustomId('lista')
                    .setStyle("PRIMARY")
                    .setEmoji(`${emojis.mail}`),

                    new MessageButton()
                    .setCustomId('desactivar')
                    .setStyle("DANGER")
                    .setEmoji(`${emojis.negativo}`)
                )
                    const Seleccion = new MessageEmbed()
                    .setTitle("Información")
                    .setDescription(`${emojis.reglas} - Menu de selección del modulo \`antipalabras\`, porfavor selecciona el boton para realizar la acción que desees. \n\n ${emojis.nueva} - \`Añadir una palabra a la blacklist\`\n\n  ${emojis.remover} - \`Remover una palabra de la blacklist\`\n\n${emojis.mail} - \`Lista de palabras blacklisteadas\` \n\n${emojis.negativo} - \`Desactivar antipalabras\` `)
                    .setColor("BLUE")
                    .setTimestamp()
                    let confirmacion = await message.reply({ embeds: [Seleccion], components: [row], allowedMentions: { repliedUser: false } });
                    const filter = i => i.user.id === message.author.id;
                    const colector = confirmacion.createMessageComponentCollector({ filter: filter, time: 20000 });
                    colector.on('collect', async i => { 
                        if(i.customId === "nueva") {
                            await i.deferUpdate()
                            await i.deleteReply();
                            const Response1 = new MessageEmbed()
                            .setTitle("Información")
                            .setDescription(`${emojis.cargando} | \`Escriba la palabra despues de este mensaje\``)
                            .setColor("BLUE")
                            let msgE = await message.channel.send({ embeds: [Response1], allowedMentions: { repliedUser: false } })
                            const filtro = (m) => m.author.id === message.author.id;
                            const coleccion = new Discord.MessageCollector(message.channel, filtro);
                            coleccion.on('collect', async msg => {
                                if(msg.author.id === message.author.id) {
                                    const palabras = Palabras.palabras;
                                    if(palabras.length > 15) {
                                        const Response = new MessageEmbed()
                                        .setTitle("Información")
                                        .setDescription(`${emojis.negativo} | \`Haz excedido el limite de palabras, el maximo es 15\``)
                                        .setColor("RED")
                                        return msgE.edit({ embeds: [Response], components: [], allowedMentions: { repliedUser: false } });
                                        coleccion.stop();
                                    }
                                    if(palabras.some(w => msg.content.toLowerCase().includes(w))) {
                                        const Response = new MessageEmbed()
                                        .setTitle("Información")
                                        .setDescription(`${emojis.negativo} | \`Esa palabra ya existe\``)
                                        .setColor("RED")
                                        msgE.edit({ embeds: [Response], components: [], allowedMentions: { repliedUser: false } })
                                        coleccion.stop();
                                    } else {
                                        palabras.push(msg.content)
                                        await Palabras.save();
                                        const Response = new MessageEmbed()
                                        .setTitle("Información")
                                        .setDescription(`${emojis.positivo} | \`Palabra añadida correctamente\``)
                                        .setColor("GREEN")
                                        msgE.edit({ embeds: [Response], components: [], allowedMentions: { repliedUser: false } });
                                        coleccion.stop();
                                    }
                                } 
                            });
                        } else if(i.customId === "remover") {
                            await i.deferUpdate()
                            await i.deleteReply();
                            const Response1 = new MessageEmbed()
                            .setTitle("Información")
                            .setDescription(`${emojis.cargando} | \`Escriba la palabra despues de este mensaje\``)
                            .setColor("BLUE")
                            let msgE = await message.channel.send({ embeds: [Response1], allowedMentions: { repliedUser: false } })
                            const filtro = (m) => m.author.id === message.author.id;
                            const coleccion = new Discord.MessageCollector(message.channel, filtro);
                            coleccion.on('collect', async msg => {
                                if(msg.author.id === message.author.id) {
                                    const palabras = Palabras.palabras;
                                    const palabra = palabras.find(w => w === msg.content)
                                    if(palabra) {
                                        const i = palabras.indexOf(palabra)
                                        console.log(i)
                                        palabras.splice(i, 1)
                                        await Palabras.save();
                                        const Response = new MessageEmbed()
                                        .setTitle("Información")
                                        .setDescription(`${emojis.positivo} | \`Palabra removida correctamente\``)
                                        .setColor("GREEN")
                                        msgE.edit({ embeds: [Response], components: [], allowedMentions: { repliedUser: false } })
                                        coleccion.stop();
                                    } else {
                                        const Response = new MessageEmbed()
                                        .setDescription(`${emojis.negativo} | \`Esa palabra no existe\``)
                                        .setColor("RED")
                                        msgE.edit({ embeds: [Response], components: [], allowedMentions: { repliedUser: false } })
                                        coleccion.stop();
                                    }
                                }
                            });
                        } else if(i.customId === "lista") {
                            const palabras = Palabras.palabras;
                            const descripcion = palabras.map((p, i) => {
                                return `\n${i+1}. - ${p}`
                            });
                            const Embed = new MessageEmbed()
                            .setDescription(`**Lista de palabras no permitidas:**\n${descripcion.join(" ")}`)
                            .setColor("BLUE")
                            .setTimestamp()
                            await i.deferUpdate()
                            await i.editReply({ embeds: [Embed], components: [], allowedMentions: { repliedUser: false } });
                        } else if(i.customId === "desactivar") {
                            Palabras.actived = false;
                            await Palabras.save();
                            await i.deferUpdate()
                            await i.editReply({ content: `${emojis.positivo} | \`Ententido, he desactivado el antipalabras\``, embeds: [], components: [], allowedMentions: { repliedUser: false } });
                        }
                    });
                } else if(!Palabras.actived) {
                    const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                    .setCustomId('si')
                    .setStyle('SUCCESS')
                    .setLabel('Continuar')
                    .setEmoji(`${emojis.positivo}`),

                    new MessageButton()
                    .setCustomId('no')
                    .setStyle('DANGER')
                    .setLabel('Cancelar')
                    .setEmoji(`${emojis.negativo}`)
                )
                const Embed = new MessageEmbed()
                .setTitle("Información")
                .setDescription(`${emojis.escudo} | \`¿Estas seguro de activar el antipalabras en este servidor?\``)
                .setColor("BLUE")
                .setTimestamp()
                let confirmacion = await message.reply({ embeds: [Embed], components: [row], allowedMentions: { repliedUser: false } });
                const filter = i => i.user.id === message.author.id;
                const colector = confirmacion.createMessageComponentCollector({ filter: filter, time: 20000 });
                colector.on('collect', async i => {
                    if(i.customId === "si") {
                        Palabras.actived = true;
                        await Palabras.save();
                        const Response = new MessageEmbed()
                        .setTitle("Información")
                        .setDescription(`${emojis.positivo} | \`Entendido, he activado el antipalabras, para configurarlo usa de nuevo ${prefix}antipalabras\``)
                        .setColor("BLUE")
                        .setTimestamp()
                        await Palabras.save();
                        await i.deferUpdate();
                        await i.editReply({ embeds: [Response], components: [], allowedMentions: { repliedUser: false } });
                    } else if(i.customId === "no") {
                        const Response = new MessageEmbed()
                        .setTitle("Información")
                        .setDescription(`${emojis.positivo} | \`Entendido, he cancelado el comando\``)
                        .setColor("BLUE")
                        .setTimestamp()
                        await i.deferUpdate();
                        await i.editReply({ embeds: [Response], components: [], allowedMentions: { repliedUser: false } });
                    }
                });
                }
            }
        }
    }
}