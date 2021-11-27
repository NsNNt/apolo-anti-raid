const { MessageEmbed, MessageActionRow, Message, MessageButton } = require("discord.js");
const AntiChannels = require("../../Models/AntiChannels");
const AntiRoles = require("../../Models/AntiRoles");
const AntiRaid = require("../../Models/AntiRaid");
const emojis = require("../../emojis");

module.exports = {
    name: "antiraid",
    aliases: ["anti-raid"],
    description: "Configura el servidor contra raids",
    cooldown: 5,
    permissions: "OWNER",
    /**
     * @param {Message} message
     */
    async execute(message, args, commandName, client, Discord, prefix) {
        if(message.guild.ownerId !== message.author.id) {
            return message.reply({ content: `Solo el __propietario__ de este servidor puede usar esto`, allowedMentions: { repliedUser: false } });
        } else {
            if(!message.guild.me.permissions.has("ADMINISTRATOR")) {
                return message.reply({ content: `No puedo interactuar con este servidor sin los siguientes permisos: \`ADMINISTRADOR\``, allowedMentions: { repliedUser: false } });
            }
            let ap_ac;
            let ap_ar;
            const antiraid = await AntiRaid.findOne({ guildId: message.guild.id });
            if(!antiraid) {
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
                .setDescription(`${emojis.escudo} | \`¿Estas seguro de activar el Anti-Raid en este servidor?\``)
                .setColor("BLUE")
                .setTimestamp()
                let confirmacion = await message.reply({ embeds: [Embed], components: [row], allowedMentions: { repliedUser: false } });
                const filter = i => i.user.id === message.author.id;
                const colector = confirmacion.createMessageComponentCollector({ filter: filter, time: 20000 });
                colector.on('collect', async i => {
                    if(i.customId === "si") {
                        const createAntiRaid = new AntiRaid({
                            guildId: message.guild.id,
                            actived: true,
                            maxChannelsCreate: 3,
                            maxRolesCreate: 3,
                            maxChannelsDelete: 2,
                            maxRolesDelete: 2,
                            maxBansNumber: 3,
                            maxKickNumber: 3,
                            sancionType: "ban"
                        });
                        const Response = new MessageEmbed()
                        .setTitle("Información")
                        .setDescription(`${emojis.positivo} | \`Entendido, he activado el Anti-Raid, para configurarlo usa ${prefix}antiraid-settings\``)
                        .setColor("BLUE")
                        .setTimestamp()
                        await createAntiRaid.save();
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
                if(antiraid?.actived) {
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
                    .setDescription(`${emojis.escudo} | \`¿Estas seguro de desactivar el Anti-Raid en este servidor?\``)
                    .setColor("BLUE")
                    .setTimestamp()
                    let confirmacion = await message.reply({ embeds: [Embed], components: [row], allowedMentions: { repliedUser: false } });
                    const filter = i => i.user.id === message.author.id;
                    const colector = confirmacion.createMessageComponentCollector({ filter: filter, time: 20000 });
                    colector.on('collect', async i => {
                        if(i.customId === "si") {
                            const Response = new MessageEmbed()
                            .setTitle("Información")
                            .setDescription(`${emojis.positivo} | \`Entendido, he desactivado el Anti-Raid\``)
                            .setColor("BLUE")
                            .setTimestamp()
                            antiraid.actived = false;
                            await antiraid.save();
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
                    .setDescription(`${emojis.escudo} | \`¿Estas seguro de activar el Anti-Raid en este servidor?\``)
                    .setColor("BLUE")
                    .setTimestamp()
                    let confirmacion = await message.reply({ embeds: [Embed], components: [row], allowedMentions: { repliedUser: false } });
                    const filter = i => i.user.id === message.author.id;
                    const colector = confirmacion.createMessageComponentCollector({ filter: filter, time: 20000 });
                    colector.on('collect', async i => {
                        if(i.customId === "si") {
                            const Response = new MessageEmbed()
                            .setTitle("Información")
                            .setDescription(`${emojis.positivo} | \`Entendido, he activado el Anti-Raid, para configurarlo usa ${prefix}antiraid-settings\``)
                            .setColor("BLUE")
                            .setTimestamp()
                            antiraid.actived = true;
                            await antiraid.save();
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