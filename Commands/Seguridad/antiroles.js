const { MessageEmbed, MessageActionRow, Message, MessageButton } = require("discord.js");
const AntiRoles = require("../../Models/AntiRoles");
const emojis = require("../../emojis");

module.exports = {
    name: "antiroles",
    aliases: ["anti-roles"],
    description: "Evita que los usuarios creen demasiados roles",
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
            const antiroles = await AntiRoles.findOne({ guildId: message.guild.id });
            if(!antiroles) {
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
                .setDescription(`${emojis.escudo} | \`¿Estas seguro de activar el Anti-Roles en este servidor?\``)
                .setColor("BLUE")
                .setTimestamp()
                let confirmacion = await message.reply({ embeds: [Embed], components: [row], allowedMentions: { repliedUser: false } });
                const filter = i => i.user.id === message.author.id;
                const colector = confirmacion.createMessageComponentCollector({ filter: filter, time: 20000 });
                colector.on('collect', async i => {
                    if(i.customId === "si") {
                        const createAntiRoles = new AntiRoles({
                            guildId: message.guild.id,
                            actived: true
                        });
                        const Response = new MessageEmbed()
                        .setTitle("Información")
                        .setDescription(`${emojis.positivo} | \`Entendido, he activado el Anti-Roles\``)
                        .setColor("BLUE")
                        .setTimestamp()
                        await createAntiRoles.save();
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
                if(antiroles?.actived) {
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
                    .setDescription(`${emojis.escudo} | \`¿Estas seguro de desactivar el Anti-Roles en este servidor?\``)
                    .setColor("BLUE")
                    .setTimestamp()
                    let confirmacion = await message.reply({ embeds: [Embed], components: [row], allowedMentions: { repliedUser: false } });
                    const filter = i => i.user.id === message.author.id;
                    const colector = confirmacion.createMessageComponentCollector({ filter: filter, time: 20000 });
                    colector.on('collect', async i => {
                        if(i.customId === "si") {
                            const Response = new MessageEmbed()
                            .setTitle("Información")
                            .setDescription(`${emojis.positivo} | \`Entendido, he desactivado el Anti-Roles\``)
                            .setColor("BLUE")
                            .setTimestamp()
                            antiroles.actived = false;
                            await antiroles.save();
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
                    .setDescription(`${emojis.escudo} | \`¿Estas seguro de activar el Anti-Roles en este servidor?\``)
                    .setColor("BLUE")
                    .setTimestamp()
                    let confirmacion = await message.reply({ embeds: [Embed], components: [row], allowedMentions: { repliedUser: false } });
                    const filter = i => i.user.id === message.author.id;
                    const colector = confirmacion.createMessageComponentCollector({ filter: filter, time: 20000 });
                    colector.on('collect', async i => {
                        if(i.customId === "si") {
                            const Response = new MessageEmbed()
                            .setTitle("Información")
                            .setDescription(`${emojis.positivo} | \`Entendido, he activado el Anti-Roles\``)
                            .setColor("BLUE")
                            .setTimestamp()
                            antiroles.actived = true;
                            await antiroles.save();
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