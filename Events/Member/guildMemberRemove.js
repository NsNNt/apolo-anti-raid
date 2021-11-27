const { Client, GuildMember, MessageEmbed } = require("discord.js");
const Muted = require("../../Models/Muted");
const MutedRole = require("../../Models/MutedRole");

module.exports = {
    name: "guildMemberRemove",
    /**
     * @param {Client} client
     * @param {GuildMember} member
     */
     async execute(member) {
         if(member.guild.id !== "866670008201773067") {
            return;
         } else {
            const channel = await member.guild.channels.cache.get("901608874036043817")
            channel.send({ content: `${member.user.username} Ha abandonado la publica.` });
         }
     }
}