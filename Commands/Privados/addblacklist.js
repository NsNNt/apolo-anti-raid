const { MessageEmbed, MessageActionRow, Message, MessageButton, Client } = require("discord.js");
const Blacklist = require("../../Models/Blacklist");
const emojis = require("../../emojis");

module.exports = {
    name: "bloquear",
    aliases: ["bloq"],
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
            const id = args[0];
            const prueba = args[1];
            const razon = args.slice(2).join(" ");
            if(!id && !prueba && !razon) {
                return message.reply({ content: `${emojis.negativo} | \`Uso correcto: ap!block <id> <prueba> <razon>\``, allowedMentions: { repliedUser: false } })
            } else {
                const exists = await Blacklist.findOne({
                    userId: id
                });
                if(exists) {
                    return message.channel.send({ content: "Ese usuario ya esta en blacklist" })
                }
                client.users.fetch(id).then(async u => {
                    const blacklist = new Blacklist({
                        userId: id,
                        pruebas: prueba,
                        razon: razon
                    });
                    await blacklist.save();
                    message.reply({ content: `\`${u.username}\` Fue bloqueado del bot`, allowedMentions: { repliedUser: false } });
                    const Embed = new MessageEmbed()
                    .setDescription(`\`${u.username}\` Fue bloqueado del bot\n\nID: ${u.id}\n\nRazón: \`${razon}\``)
                    .setImage(prueba)
                    .setColor("BLUE")
                    .setTimestamp()
                    .setFooter("Apolo Security")
                    client.channels.cache.get("905631207537127424").send({ embeds: [Embed] });
                }).catch(e => { return message.channel.send({ content: "No existe ese usuario." }) })
            }
        }
    }
}