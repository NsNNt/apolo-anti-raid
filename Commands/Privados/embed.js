const { MessageEmbed, MessageActionRow, Message, MessageButton } = require("discord.js");

module.exports = {
    name: "embed",
    aliases: ["embed"],
    description: "Comando privado",
    permissions: "Privado",
    /**
     * @param {Message} message
     */
    async execute(message, args, commandName, client, Discord) {
        if(message.author.id !== "852969002678222868") {
            return;
        } else {
            const color = args[0]
            if(!color || !color.startsWith("#")) {
                const Response = new MessageEmbed()
                .setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true }))
                .setDescription("Uso incorrecto `#000`")
                .setColor("DARKER_GREY")
                return message.reply({ embeds: [Response], allowedMentions: { repliedUser: false } });
            }
            const contenido = args.slice(1).join(" ");
            if(!contenido) {
                const Response = new MessageEmbed()
                .setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true }))
                .setDescription("Uso incorrecto")
                .setColor("DARKER_GREY")
                return message.reply({ embeds: [Response], allowedMentions: { repliedUser: false } });
            }
            const Respuesta = new MessageEmbed()
            .setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true }))
            .setDescription(`${contenido}`)
            .setColor(`${color}`)
            .setTimestamp()
            message.delete()
            message.channel.send({ embeds: [Respuesta] });
        }
    }
}   