const { MessageEmbed, MessageActionRow, Message, MessageButton } = require("discord.js");
const RaidLogs = require("../../Models/RaidLogs");
const AntiRaid = require("../../Models/AntiRaid");
const emojis = require("../../emojis");

module.exports = {
    name: "raid-logs",
    aliases: ["raidlogs"],
    usage: "raid-logs {activar/desactivar/setChannel} [Canal]",
    description: "Activa o configura los logs de raid en tu servidor.",
    cooldown: 2,
    permissions: "OWNER",
    /**
     * @param {Message} message
     */
    async execute(message, args, commandName, client, Discord, prefix) {
    	if(message.author.id !== message.guild.ownerId) {
            return message.channel.send({ content: "Solo el __propietario__ de este servidor puede usar esto." });
        }
        if(!message.guild.me.permissions.has("ADMINISTRATOR")) {
            return message.channel.send({ content: "No tengo __administrador__ para poder usar esto." });
        }
        const Antiraid = await AntiRaid.findOne({ guildId: message.guild.id });
        if(!Antiraid) {
            return message.channel.send({ content: "El `Anti-Raid` no esta activado en este servidor, utiliza: `"+prefix+"anti-raid`" });
        }
        if(!Antiraid?.actived) {
            return message.channel.send({ content: "El `Anti-Raid` no esta activado en este servidor, utiliza: `"+prefix+"anti-raid`" });
        }
        if(!args[0]) {
            return message.channel.send({ content: "Esa acción no esta disponible, utiliza alguna de las siguientes: `setChannel`, `activar`, `desactivar`" });
        }
        if(!['setChannel', 'activar', 'desactivar'].some(a => a.toLowerCase() === args[0].toLowerCase())) {
            return message.channel.send({ content: "Esa acción no esta disponible, utiliza alguna de las siguientes: `setChannel`, `activar`, `desactivar`" });
        }
        const raidlogs = await RaidLogs.findOne({ guildId: message.guild.id });
        if(args[0].toLowerCase() === "setchannel") {
            if(!raidlogs) {
                return message.channel.send({ content: "Los logs no estan activados en este servidor, usa: `"+prefix+"raid-logs activar`" });
            }
            if(!raidlogs?.actived) {
                return message.channel.send({ content: "Los logs no estan activados en este servidor, usa: `"+prefix+"raid-logs activar`" });
            }
            const canal = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]);
            if(!canal) {
                return message.channel.send({ content: "Proporciona un canal valido, ej: `"+prefix+"raid-logs setChannel #raid-logs`" });
            }
            raidlogs.channelId = canal.id;
            await raidlogs.save();
            message.channel.send({ content: `${canal} colocado correctamente!` });
            canal.send({ content: `${emojis.positivo} > Enviare en este canal todos los logs de raid.` })
        }
        if(args[0].toLowerCase() === "activar") {
            if(raidlogs?.actived) {
                return message.channel.send({ content: "Los logs de raid ya estan activados en este servidor." });
            }
            if(!raidlogs) {
                const rlogs = new RaidLogs({
                    guildId: message.guild.id,
                    channelId: "No definido.",
                    actived: true
                });
                await rlogs.save();
                message.channel.send({ content: "Los logs de raid se han activado en este servidor." });
            } else {
                raidlogs.actived = true;
                await raidlogs.save();
                message.channel.send({ content: "Los logs de raid se han activado en este servidor." });
            }
        }
        if(args[0].toLowerCase() === "desactivar") {
            if(!raidlogs) {
                return message.channel.send({ content: "Los logs de raid ya estan desactivados en este servidor." });
            }
            if(!raidlogs?.actived) {
                return message.channel.send({ content: "Los logs de raid ya estan desactivados en este servidor." });
            }
            raidlogs.actived = false;
            await raidlogs.save();
            message.channel.send({ content: "Los logs de raid se han desactivado en este servidor." });
        }
    }
}