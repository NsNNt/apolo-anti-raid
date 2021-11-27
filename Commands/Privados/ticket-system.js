const { MessageEmbed, MessageActionRow, Message, MessageButton, Client } = require("discord.js");
const emojis = require("../../emojis");

module.exports = {
    name: "setsystem",
    aliases: ["set-system"],
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
            const channel = await client.channels.cache.get("901581208390107167")
            const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                .setCustomId("ticket")
                .setLabel("Abrir Ticket")
                .setStyle("PRIMARY"),
                new MessageButton()
                .setCustomId("cerrar")
                .setLabel("Cerrar Ticket")
                .setStyle("DANGER")
            )
            const Embed = new MessageEmbed()
            .setDescription("¿Tienes dudas o necesitas ayuda?, puedes contactar con el soporte haciendo click en el boton de abajo!")
            .setColor("#1528F8")
            channel.send({ embeds: [Embed], components: [row] });
        }
    }
}