const { MessageEmbed, MessageActionRow, Message, MessageButton } = require("discord.js");
const emojis = require("../../emojis");

module.exports = {
    name: "reportar",
    aliases: ["reporte", "report"],
    usage: "reportar <Id> <Link/URL>",
    description: "Reporta a un usuario para ser añadido a la blacklist",
    cooldown: 5,
    /**
     * @param {Message} message
     */
    async execute(message, args, commandName, client, Discord, prefix) {
        const id = args[0]
        const pruebas = args[1]
        if(!id && !pruebas || !pruebas) {
            return message.channel.send({ content: `${message.author}, Este reporte no puede ser enviado. \`${prefix}reportar <id> <link de prueba>\`` });
        }
        const noaceptadas = ["no se", "porque si", "me cae mal", "asd"];
        if(!message.content.includes("https://") && noaceptadas.some(w => pruebas.toLowerCase().includes(w))) {
            return message.reply({ content: `${message.author}, Este reporte no puede ser enviado. \`${prefix}reportar <id> <link de prueba>\`` });
        } else {
            if(isNaN(id)) {
                return message.channel.send({ content: "Eso no es una id!" });
            }
            const canal = await client.channels.cache.get("901607208284991489")
            const embed = new MessageEmbed()
            .setDescription(`Nuevo reporte hecho:\n\n ID: \`${id}\` \nPruebas: ${pruebas}`)
            .setColor("BLUE")
            .setTimestamp()
            .setFooter(`${message.author.id}`)

            canal.send({ embeds: [embed] });
            message.channel.send({ embeds: [embed] })
        }
    }
}