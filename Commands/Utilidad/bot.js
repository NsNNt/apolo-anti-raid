const { MessageEmbed, MessageActionRow, Message, MessageButton } = require("discord.js");
const Blacklist = require("../../Models/Blacklist");
const emojis = require("../../emojis");
const moment = require("moment"); 
const ms = require("ms");
const package = require("../../package.json");

module.exports = {
    name: "bot",
    aliases: ["debug"],
    description: "Información del bot",
    cooldown: 5,
    /**
     * @param {Message} message
     */
    async execute(message, args, commandName, client, Discord) {
        const count = await Blacklist.find();

        const Embed = new MessageEmbed()
        .setTitle("Apolo - Información:")
        .setDescription(`**Bot:**\n**🪐 - Tag:** \`${client.user.tag}\`\n**🆔 - ID**: \`${client.user.id}\`\n**📗 - Versión**: \`${package.version}\`\n**📂 - Dependencias**: \`discord.js, fs, moment, path, mongoose, ms\`\n**🚧 - Servidores:** \`${client.guilds.cache.size}\`\n**👥 - Usuarios totales:** \`${client.users.cache.size}\`\n**🏁 - Usuarios en blacklist:** \`${count.length}\`\n**⏱ - Uptime:** <t:${parseInt(client.readyTimestamp / 1000)}:R>\n\n**Host:**\n**📝- Nombre:** \`Senly Host\`\n**💽 - RAM:** \`${process.memoryUsage().rss.toFixed(3) / 1024 / 1024}mb\`\n**🖥 - CPU:** \`${process.cpuUsage().system}\``)
        .setColor("BLUE")
        
        message.channel.send({ embeds: [Embed] })
    }
}