const { Client, Message, MessageEmbed } = require("discord.js");

module.exports = {
    name: "cmd",
    aliases: ["comando", "info", "command"],
    usage: "command {Comando}",
    description: "Te da información de un comando",
    cooldown: 3,
    /**
     * 
     * @param {Message} message  
     * @param {Client} client 
     */
    async execute(message, args, commandName, client, Discord, prefix) {
        const commandToFind = args[0]
        if(!commandToFind) {
            const ErrorEmbed = new MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setDescription("❌ | Porfavor coloque el nombre del comando para ver la informacion de este.\n\n 🗒 | Ejemplo: __`"+prefix+"cmd <args>`__")
            .setColor("RED")
            .setTimestamp()
            .setFooter("Apolo")
            return message.reply({ embeds: [ErrorEmbed], allowedMentions: { repliedUser: false } });
        } else {
            const command = client.commands.get(commandToFind) || 
            client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandToFind));
            if(!command) {
                const ErrorEmbed = new MessageEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription("> ❌ | **Ese comando no existe, porfavor verifique que haya puesto el nombre del comando correctamente**\n\n 🗒 | Ejemplo: __`"+prefix+"cmd <args>`__")
                .setColor("RED")
                .setTimestamp()
                .setFooter("Apolo")
                return message.reply({ embeds: [ErrorEmbed], allowedMentions: { repliedUser: false } });
            } else {
                const CommandInfo = new MessageEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                .setDescription(`**Nombre:** \`${command.name}\`\n**Alias:** \`${command.aliases.map(alias => `${alias}`).join(" ")}\`\n**Uso:** \`${command.usage ? `${prefix}${command.usage}` : `${prefix}${command.name}`}\` \n**Cooldown:** \`${command.cooldown ? `${command.cooldown}s` : "No tiene cooldown"}\` \n**Permisos:** \`${command.permissions ? command.permissions : "No hay permisos requeridos"}\`\n**Descripción:** \`\`\`yaml\n${command.description}\`\`\``)
                .setTimestamp()
                .setFooter("Apolo")
                .setColor("BLUE")
                message.reply({ embeds: [CommandInfo], allowedMentions: { repliedUser: false } });
            }
        }
    }
}