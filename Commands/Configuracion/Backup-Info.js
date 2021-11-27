const { MessageEmbed, MessageActionRow, Message, MessageButton, Client } = require("discord.js");
const emojis = require("../../emojis");
const GBC = require("../../Models/GuildBackupCreate");
const Premium = require("../../Models/UserPremium");
const backup = require("discord-backup");

module.exports = {
    name: "backup-info",
    aliases: ["servidor-info"],
    description: "Obtén información de una backup tuya",
    usage: "backup-info <BackupId>",
    cooldown: 2,
    /**
     * @param {Message} message
     * @param {Client} Client
     */
    async execute(message, args, commandName, client, Discord, prefix) {
        const UserIsPremium = await Premium.findOne({ userId: message.author.id });
        if(!UserIsPremium) {
            return message.channel.send({ content: "Este comando es de uso `premium`!, unete a nuestro servidor de soporte para más información. https://discord.gg/tPWYAPhhwz" });
        }
        const backupId = args[0]
        if(!backupId) {
            return message.channel.send({ content: "¡Tienes que proporcionar una id!" });
        }
        const backupSearch = await GBC.findOne({ backupId: backupId });
        if(!backupSearch) {
            return message.channel.send({ content: "¡Tienes que proporcionar una id valida!" });
        } else {
            if(backupSearch?.authorId !== message.author.id) {
                message.channel.send({ content: "¡Esa backup no te pertenece!" });
            } else {
                const info = await backup.fetch(backupId).catch(e => {});
                const Embed = new MessageEmbed()
                .setDescription(`Información de la backup \`${info.id}\``)
                .addFields([
                    {
                        name: "📜 | Nombre",
                        value: `\`\`\`${info.data.name}\`\`\``,
                        inline: true
                    }, 
                    {
                        name: "📚 | Categorias",
                        value: `\`\`\`${info.data.channels.categories.length}\`\`\``,
                        inline: true
                    },
                    {
                        name: "📜 | Otros Canales",
                        value: `\`\`\`${info.data.channels.others.length}\`\`\``,
                        inline: true
                    },
                    {
                        name: "🌐 | Roles",
                        value: `\`\`\`${info.data.roles.length}\`\`\``,
                        inline: true
                    },
                    {
                        name: "🪐 | Emojis",
                        value: `\`\`\`${info.data.emojis.length}\`\`\``
                    }
                ])
                .setColor("BLUE")
                .setFooter(message.guild.name)
                .setTimestamp()

                message.channel.send({ embeds: [Embed] });
            }
        }
    }
}