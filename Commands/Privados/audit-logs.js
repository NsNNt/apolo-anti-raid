const { MessageEmbed, MessageActionRow, Message, MessageButton, Client } = require("discord.js");
const { inspect } = require("util");
const emojis = require("../../emojis");

module.exports = {
    name: "audit-logs",
    aliases: ["audit-logs"],
    description: "Comando privado",
    permissions: "Privado",
    /**
     * @param {Message} message
     * @param {Client} client
     */
    async execute(message, args, commandName, client, Discord) {
        if(message.author.id !== "852969002678222868") {
            return;
        } else {
            const guildId = args[0];
            const limites = args[1];
            const filter = args[2];
            if(filter) {
                const guild = client.guilds.cache.get(guildId);
                const audit = await guild.fetchAuditLogs({
                    limit: limites,
                    type: filter
                });
                const action = audit.entries;
                const dsc = action
                .sort((a, b) => { return a.createdTimestamp - b.createdTimestamp })
                .map((a) => { return `Acción: \`${a.action}\` => \`${a.executor.tag}\` | \`${a.executor.id}\`` })
                .join("\n");
    
                message.channel.send({
                    embeds: [
                        {
                            title: `Mostrando ${limites} registros en ${guild.name}:`,
                            description: `${dsc}`,
                            color: 19455,
                            footer: {
                                "text": `${guild.name}`
                            }
                        }
                    ]
                });
            } else {
                const guild = client.guilds.cache.get(guildId);
                const audit = await guild.fetchAuditLogs({
                    limit: limites
                });
                const action = audit.entries;
                const dsc = action
                .sort((a, b) => { return a.createdTimestamp - b.createdTimestamp })
                .map((a) => { return `Acción: \`${a.action}\` => \`${a.executor.tag}\` | \`${a.executor.id}\`` })
                .join("\n");
    
                message.channel.send({
                    embeds: [
                        {
                            title: `Mostrando ${limites} registros en ${guild.name}:`,
                            description: `${dsc}`,
                            color: 19455,
                            footer: {
                                "text": `${guild.name}`
                            }
                        }
                    ]
                });
            }
        }
    }
}