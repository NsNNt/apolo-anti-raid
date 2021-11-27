const { MessageEmbed, MessageActionRow, Message, MessageButton, MessageSelectMenu } = require("discord.js");
const AutoMod = require("../../Models/AutoModerador");
const AntiLinks = require("../../Models/AntiLinks");
const AntiFlood = require("../../Models/AntiFlood");
const MutedRole = require("../../Models/MutedRole");
const emojis = require("../../emojis");

module.exports = {
    name: "automoderador-config",
    aliases: ["automodconfig", "auto-moderador-config", "auto-mod-config", "automod-config"],
    description: "Configura el automoderador a tu gusto",
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
            const antilinks = await AntiLinks.findOne({ guildId: message.guild.id });
            const antiflood = await AntiFlood.findOne({ guildId: message.guild.id });
            const mutedrole = await MutedRole.findOne({ guildId: message.guild.id });
            if(!mutedrole) {
                return message.channel.send({ content: `No has establecido un rol para mutear, colocalo con \`${prefix}setmuterole\`` });
            }
            if(!automod) {
                return message.channel.send({ content: `El Auto-Moderador esta desactivado en este servidor, activelo usando \`auto-moderador\`` });
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
            if(!automod?.actived) {
                return message.channel.send({ content: `El Auto-Moderador esta desactivado en este servidor, activelo usando \`auto-moderador\`` })
            }
            const Embed = new MessageEmbed()
            .setTitle("Información")
            .setDescription(`${emojis.cargando} | \`Obteniendo la configuración de tu servidor\``)
            .setColor("BLUE")
            .setFooter(message.guild.name)
            .setTimestamp()

            let msg = await message.channel.send({ embeds: [Embed] });
            if(!automod?.maxWarnMute) {
                message.channel.send({ content: "No existen datos en este servidor o se han perdido..." })
                let a_x001 = await message.channel.send({ content: "Intentando arreglar el error..." });
                await AutoMod.findOneAndDelete({ guildId: message.guild.id });
                const createAutoMod = new AutoMod({
                    guildId: message.guild.id,
                    actived: true
                });
                await createAutoMod.save();
                a_x001.edit({ content: "El error se arreglo correctamente!" });
            } else {
                const row = new MessageActionRow()
                .addComponents(
                    new MessageSelectMenu()
                    .setCustomId("ap_slmamd")
                    .setMaxValues(1)
                    .addOptions(
                        [
                            {
                                label: "Configuración",
                                emoji: "⚙",
                                description: "Revisa la configuración de tu servidor",
                                value: "ap_cfgr"
                            },
                            {
                                label: "Actualizar",
                                emoji: "📚",
                                description: "Actualiza la configuración de tu servidor",
                                value: "ap_alzr"
                            }
                        ]
                    )
                )
                const Response = new MessageEmbed()
                .setTitle("Información")
                .setDescription(`${emojis.moderacion} | \`Configuración cargada correctamente, ¿Qué información quieres?\``)
                .setColor("BLUE")
                .setFooter(message.guild.name)
                .setTimestamp()
                let m = await msg.edit({ embeds: [Response], components: [row] });
                const ifilter = (m) => m.user.id === message.author.id;
                const colector = m.createMessageComponentCollector({ filter: ifilter, time: 60000 });
                colector.on('collect', async (i) => {
                    if(i.values[0] === "ap_cfgr") {
                        const Configuracion = new MessageEmbed()
                        .setTitle("Información del automoderador:")
                        .addFields([
                            {
                                name: `🔇 | Warns para mutear`,
                                value: `\`${automod?.maxWarnMute}\` warns = Mute por 10m (600000ms)`
                            },
                            {
                                name: `⛔ | Warns para expulsión`,
                                value: `\`${automod?.maxWarnKick}\` warns = Kick`
                            },
                            {
                                name: `🔨 | Warns para ban`,
                                value: `\`${automod?.maxWarnBan}\` warns = Ban`
                            }
                        ])
                        .setColor("BLUE")
                        .setFooter(message.guild.name)
                        .setTimestamp()
                        await i.reply({ embeds: [Configuracion], ephemeral: true });
                    } else if(i.values[0] === "ap_alzr") {
                        const WarnsMute = new MessageEmbed()
                        .setTitle("Información")
                        .setDescription(`${emojis.cargando} | \`Ok, empecemos la configuración. ¿Cuántos warns tengo que dar antes de mutear?\``)
                        .setColor("BLUE")
                        .setFooter(message.guild.name)
                        .setTimestamp()
                        message.channel.send({ embeds: [WarnsMute] });
                        const colector = await message.channel.awaitMessages({ filter: (m) => m.author.id === message.author.id, max: 1 });
                        const warns = colector.first().content;
                        if(isNaN(warns)) {
                            return message.channel.send({ content: "Eso no es un número, porfavor intentalo de nuevo." });
                        } else {
                            if(warns >= automod?.maxWarnKick) {
                                return message.channel.send({ content: "La cantidad debe ser menor a la establecida para expulsar" });
                            }
                            automod.maxWarnMute = warns;
                            await automod.save();
                            const WarnsKick = new MessageEmbed()
                            .setTitle("Información")
                            .setDescription(`${emojis.cargando} | \`Entendido, ahora. ¿Cuántos warns tengo que dar antes de expulsar?\``)
                            .setColor("BLUE")
                            .setFooter(message.guild.name)
                            .setTimestamp()
                            message.channel.send({ embeds: [WarnsKick] });
                            const colector2 = await message.channel.awaitMessages({ filter: (m) => m.author.id === message.author.id, max: 1 });
                            const warns2 = colector2.first().content;
                            if(isNaN(warns2)) {
                                return message.channel.send({ content: "Eso no es un número, porfavor intentalo de nuevo." });
                            } else {
                                if(warns2 <= automod?.maxWarnMute) {
                                    return message.channel.send({ content: "La cantidad debe ser mayor a la establecida para mutear" });
                                }
                                if(warns2 >= automod?.maxWarnBan) {
                                    return message.channel.send({ content: "La cantidad debe ser menor a la establecida para banear" });
                                }
                                automod.maxWarnKick = warns2;
                                await automod.save();
                                const WarnsBan = new MessageEmbed()
                                .setTitle("Información")
                                .setDescription(`${emojis.cargando} | \`Muy bien, ahora. ¿Cuántos warns tengo que dar antes de banear?\``)
                                .setColor("BLUE")
                                .setFooter(message.guild.name)
                                .setTimestamp()
                                message.channel.send({ embeds: [WarnsBan] });
                                const colector3 = await message.channel.awaitMessages({ filter: (m) => m.author.id === message.author.id, max: 1 });
                                const warns3 = colector3.first().content;
                                if(isNaN(warns3)) {
                                    return message.channel.send({ content: "Eso no es un número, porfavor intentalo de nuevo." });
                                } else {
                                    if(warns3 <= automod?.maxWarnKick) {
                                        return message.channel.send({ content: "La cantidad debe ser mayor a la establecida para expulsar" });
                                    }
                                    automod.maxWarnBan = warns3;
                                    await automod.save();
                                    const R = new MessageEmbed()
                                    .setTitle("Información")
                                    .setDescription(`${emojis.positivo} | \`Muy bien, la configuración fue guardada correctamente.\``)
                                    .setColor("BLUE")
                                    .setFooter(message.guild.name)
                                    .setTimestamp()
                                    message.channel.send({ embeds: [R] });
                                }
                            }
                        }
                    }
                });
            }
        }
    }
}