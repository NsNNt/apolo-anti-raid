const { MessageEmbed, MessageActionRow, Message, MessageButton } = require("discord.js");
const emojis = require("../../emojis");

module.exports = {
    name: "verify",
    aliases: ["verificarme"],
    description: "Verificate en el servidor de Apolo",
    cooldown: 3,
    /**
     * @param {Message} message
     */
    async execute(message, args, commandName, client, Discord) {
        if(message.guild.id !== "866670008201773067") {
            return;
        } else if(message.channel.id !== "900776499727192175") {
            return;
        } else {
            message.delete()
            const Role = message.guild.roles.cache.get("900777155699560538")
            message.member.roles.add(Role)
            message.channel.send({ content: `${emojis.positivo} | \`Te has verificado correctamente\`` }).then(m => {
                setTimeout(() => {
                    m.delete()
                }, 2500);
            });
        }
    }
}