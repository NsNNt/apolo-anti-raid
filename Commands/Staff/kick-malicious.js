const { MessageEmbed, MessageActionRow, Message, MessageButton, Client } = require("discord.js");
const Staff = require("../../Models/Staff");
const Blacklist = require("../../Models/Blacklist");
const emojis = require("../../emojis");

module.exports = {
    name: "kick-malicious",
    aliases: ["kickmalicious"],
    description: "Comando privado",
    permissions: "Privado",
    /**
     * @param {Message} message
     * @param {Client} client
     */
    async execute(message, args, commandName, client, Discord) {
        const isStaff = await Staff.findOne({ userId: message.author.id });
        if(!isStaff) {
            return message.channel.send({ content: `${emojis.negativo} | \`Ese comando no existe\`` });
        }
        if(!message.guild.me.permissions.has("KICK_MEMBERS")) {
            return message.channel.send({ content: "No tengo permisos para ejecutar esto." });
        }
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if(!member) {
            return message.channel.send({ content: "Menciona o proporciona un usuario por favor." });
        }
        const memberBlack = await Blacklist.findOne({ userId: member.id });
        if(!memberBlack) {
            return message.channel.send({ content: "Ese usuario no es malicioso, no puedes expulsarlo." });
        }
        if(message.guild.me.roles.highiest.comparePositionTo(member.roles.highiest) <= 0) {
            return message.channel.send({ content: "El usuario tiene mas roles que yo, es imposible expulsarlo." });
        }
        message.guild.members.kick(member, `Usuario Malicioso - ${message.author.tag}`).catch(e => {});
        message.channel.send({ content: "Malicioso expulsado correctamente." })
    }
}