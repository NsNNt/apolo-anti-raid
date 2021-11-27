const { MessageEmbed, MessageActionRow, Message, MessageButton } = require("discord.js");
const MutedRole = require("../../Models/MutedRole");
const AutoMod = require("../../Models/AutoModerador");
const AntiLinks = require("../../Models/AntiLinks");
const AntiFlood = require("../../Models/AntiFlood");
const emojis = require("../../emojis");

module.exports = {
    name: "automoderador",
    aliases: ["automod", "auto-moderador", "auto-mod"],
    description: "Activa y desactva el automoderador en tu servidor",
    permissions: "ADMINISTRATOR",
    cooldown: 2,
    /**
     * @param {Message} message
     */
    async execute(message, args, commandName, client, Discord, prefix) {
        if(!message.member.permissions.has("ADMINISTRATOR")) {
            return message.reply({ content: `${emojis.negativo} | \`No tienes permisos para ejecutar esta acción\` `, allowedMentions: { repliedUser: false } });
        } else {
            if(!message.guild.me.permissions.has("ADMINISTRATOR")) {
                return message.reply({ content: `No puedo interactuar con este servidor sin los siguientes permisos: \`ADMINISTRADOR\``, allowedMentions: { repliedUser: false } });
            }
            const automod = await AutoMod.findOne({ guildId: message.guild.id });
            const mutedrole = await MutedRole.findOne({ guildId: message.guild.id });
            const antilinks = await AntiLinks.findOne({ guildId: message.guild.id });
            const antiflood = await AntiFlood.findOne({ guildId: message.guild.id });
            if(!mutedrole) {
                return message.reply({ content: `No has establecido un rol para mutear, colocalo con \`${prefix}setmuterole\``, allowedMentions: { repliedUser: false } });
            }
            if(antilinks) {
                if(antilinks?.actived) {
                    return message.channel.send({ content: `El Anti-Links esta activado en este servidor, desactivelo para que no interfiera con la automoderación.` });
                }
            }
            if(antiflood) {
                if(antiflood?.actived) {
                    return message.channel.send({ content: `El Anti-Flood esta activado en este servidor, desactivelo para que no interfiera con la automoderación.` });
                }
            }
            if(!automod) {
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
                .setDescription(`${emojis.escudo} | \`¿Estas seguro de activar el Auto-Moderador en este servidor?\``)
                .setColor("BLUE")
                .setTimestamp()
                let confirmacion = await message.reply({ embeds: [Embed], components: [row], allowedMentions: { repliedUser: false } });
                const filter = i => i.user.id === message.author.id;
                const colector = confirmacion.createMessageComponentCollector({ filter: filter, time: 20000 });
                colector.on('collect', async i => {
                    if(i.customId === "si") {
                        const createAutoMod = new AutoMod({
                            guildId: message.guild.id,
                            actived: true
                        });
                        const Response = new MessageEmbed()
                        .setTitle("Información")
                        .setDescription(`${emojis.positivo} | \`Entendido, he activado el Auto-Moderador, para configurarlo usa ${prefix}automoderador-config\``)
                        .setColor("BLUE")
                        .setTimestamp()
                        await createAutoMod.save();
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
                if(automod.actived) {
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
                    .setDescription(`${emojis.escudo} | \`¿Estas seguro de desactivar el Auto-Moderador en este servidor?\``)
                    .setColor("BLUE")
                    .setTimestamp()
                    let confirmacion = await message.reply({ embeds: [Embed], components: [row], allowedMentions: { repliedUser: false } });
                    const filter = i => i.user.id === message.author.id;
                    const colector = confirmacion.createMessageComponentCollector({ filter: filter, time: 20000 });
                    colector.on('collect', async i => {
                        if(i.customId === "si") {
                            const Response = new MessageEmbed()
                            .setTitle("Información")
                            .setDescription(`${emojis.positivo} | \`Entendido, he desactivado el Auto-Moderador\``)
                            .setColor("BLUE")
                            .setTimestamp()
                            automod.actived = false;
                            await automod.save();
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
                    .setDescription(`${emojis.escudo} | \`¿Estas seguro de activar el Auto-Moderador en este servidor?\``)
                    .setColor("BLUE")
                    .setTimestamp()
                    let confirmacion = await message.reply({ embeds: [Embed], components: [row], allowedMentions: { repliedUser: false } });
                    const filter = i => i.user.id === message.author.id;
                    const colector = confirmacion.createMessageComponentCollector({ filter: filter, time: 20000 });
                    colector.on('collect', async i => {
                        if(i.customId === "si") {
                            const Response = new MessageEmbed()
                            .setTitle("Información")
                            .setDescription(`${emojis.positivo} | \`Entendido, he activado el Auto-Moderador, para configurarlo usa ${prefix}automoderador-config\``)
                            .setColor("BLUE")
                            .setTimestamp()
                            automod.actived = true;
                            await automod.save();
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