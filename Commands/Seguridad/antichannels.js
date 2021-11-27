const { MessageEmbed, MessageActionRow, Message, MessageButton } = require("discord.js");
const AntiChannels = require("../../Models/AntiChannels");
const emojis = require("../../emojis");

module.exports = {
    name: "anticanales",
    aliases: ["anti-canales"],
    description: "Evita que los usuarios creen/eliminen demasiados canales",
    cooldown: 5,
    permissions: "OWNER",
    /**
     * @param {Message} message
     */
    async execute(message, args, commandName, client, Discord) {
        if(message.guild.ownerId !== message.author.id) {
            return message.reply({ content: `Solo el __propietario__ de este servidor puede usar esto`, allowedMentions: { repliedUser: false } });
        } else {
            if(!message.guild.me.permissions.has("ADMINISTRATOR")) {
                return message.reply({ content: `No puedo interactuar con este servidor sin los siguientes permisos: \`ADMINISTRADOR\``, allowedMentions: { repliedUser: false } });
            }
            const anticanales = await AntiChannels.findOne({ guildId: message.guild.id });
            if(!anticanales) {
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
                .setDescription(`${emojis.escudo} | \`¿Estas seguro de activar el Anti-Canales en este servidor?\``)
                .setColor("BLUE")
                .setTimestamp()
                let confirmacion = await message.reply({ embeds: [Embed], components: [row], allowedMentions: { repliedUser: false } });
                const filter = i => i.user.id === message.author.id;
                const colector = confirmacion.createMessageComponentCollector({ filter: filter, time: 20000 });
                colector.on('collect', async i => {
                    if(i.customId === "si") {
                        const createAntiCanales = new AntiChannels({
                            guildId: message.guild.id,
                            actived: true
                        });
                        const Response = new MessageEmbed()
                        .setTitle("Información")
                        .setDescription(`${emojis.positivo} | \`Entendido, he activado el Anti-Canales\``)
                        .setColor("BLUE")
                        .setTimestamp()
                        await createAntiCanales.save();
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
            } else {
                if(anticanales?.actived) {
                    const row = new Discord.MessageActionRow()
                    .addComponents(
                        new Discord.MessageButton()
                        .setCustomId('si')
                        .setStyle('SUCCESS')
                        .setLabel('Continuar')
                        .setEmoji(`${emojis.positivo}`),

                        new Discord.MessageButton()
                        .setCustomId('no')
                        .setStyle('DANGER')
                        .setLabel('Cancelar')
                        .setEmoji(`${emojis.negativo}`)
                    )
                    const Embed = new MessageEmbed()
                    .setTitle("Información")
                    .setDescription(`${emojis.escudo} | \`¿Estas seguro de desactivar el Anti-Canales en este servidor?\``)
                    .setColor("BLUE")
                    .setTimestamp()
                    let confirmacion = await message.reply({ embeds: [Embed], components: [row], allowedMentions: { repliedUser: false } });
                    const filter = i => i.user.id === message.author.id;
                    const colector = confirmacion.createMessageComponentCollector({ filter: filter, time: 20000 });
                    colector.on('collect', async i => {
                        if(i.customId === "si") {
                            const Response = new MessageEmbed()
                            .setTitle("Información")
                            .setDescription(`${emojis.positivo} | \`Entendido, he desactivado el Anti-Canales\``)
                            .setColor("BLUE")
                            .setTimestamp()
                            anticanales.actived = false;
                            await anticanales.save();
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
                } else {
                    const row = new Discord.MessageActionRow()
                    .addComponents(
                        new Discord.MessageButton()
                        .setCustomId('si')
                        .setStyle('SUCCESS')
                        .setLabel('Continuar')
                        .setEmoji(`${emojis.positivo}`),

                        new Discord.MessageButton()
                        .setCustomId('no')
                        .setStyle('DANGER')
                        .setLabel('Cancelar')
                        .setEmoji(`${emojis.negativo}`)
                    )
                    const Embed = new MessageEmbed()
                    .setTitle("Información")
                    .setDescription(`${emojis.escudo} | \`¿Estas seguro de activar el Anti-Canales en este servidor?\``)
                    .setColor("BLUE")
                    .setTimestamp()
                    let confirmacion = await message.reply({ embeds: [Embed], components: [row], allowedMentions: { repliedUser: false } });
                    const filter = i => i.user.id === message.author.id;
                    const colector = confirmacion.createMessageComponentCollector({ filter: filter, time: 20000 });
                    colector.on('collect', async i => {
                        if(i.customId === "si") {
                            const Response = new MessageEmbed()
                            .setTitle("Información")
                            .setDescription(`${emojis.positivo} | \`Entendido, he activado el Anti-Canales\``)
                            .setColor("BLUE")
                            .setTimestamp()
                            anticanales.actived = true;
                            await anticanales.save();
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