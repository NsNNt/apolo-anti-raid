const { MessageEmbed, MessageActionRow, Message, MessageButton } = require("discord.js");
const Blacklist = require("../../Models/Blacklist");
const emojis = require("../../emojis");

module.exports = {
    name: "detectar",
    aliases: ["detectar-malicious"],
    description: "Detecta maliciosos en este servidor",
    cooldown: 5,
    /**
     * @param {Message} message
     */
    async execute(message, args, commandName, client, Discord) {
        const allBlackUsers = await Blacklist.find();
        const allGuildUsers = message.guild.members.cache;
        const malicious = [];
        const Embed = new MessageEmbed()
        .setTitle("Cargando")
        .setDescription(`${emojis.cargando} | \`Obteniendo información de la base de datos\``)
        .setColor("BLUE")
        let msg = await message.reply({ embeds: [Embed], allowedMentions: { repliedUser: false } });
        allBlackUsers.some(w => {
            const userInGuild = allGuildUsers.find(u => u.user.id === w.userId);
            const userBlack = allBlackUsers.find(u => u.userId === userInGuild?.user.id);
            if(userBlack) {
                malicious.push(userBlack)
            }
        });
        let desc;
        if(malicious.length <= 0) {
            desc = `\n${emojis.positivo} | \`No hay maliciosos en este servidor, enhorabuena.\``
        } else {  
            desc = malicious.map((u, i) => {
                const User = message.guild.members.cache.get(u.userId);
                return `\n**${i+1}. -** ${User} | \`${User.user.id}\` - Razón: \`${u.razon}\``
            }).join(" ");
        }
        const Response = new MessageEmbed()
        .setTitle("Información de la lista negra")
        .setDescription(`${desc}`)
        .setColor("BLUE")
        .setTimestamp()
        setTimeout(() => {
            msg.edit({ embeds: [Response], allowedMentions: { repliedUser: false } });
        }, 3000)
    }
}