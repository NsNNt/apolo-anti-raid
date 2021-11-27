const { Client, GuildMember, MessageEmbed } = require("discord.js");
const Muted = require("../../Models/Muted");
const MutedRole = require("../../Models/MutedRole");

module.exports = {
    name: "guildMemberAdd",
    /**
     * @param {Client} client
     * @param {GuildMember} member
     */
     async execute(member) {
         if(member.guild.id !== "866670008201773067") {
            return;
         } else {
            const channel = await member.guild.channels.cache.get("901608845254721576")
            const embed = new MessageEmbed()
            .setAuthor(member.user.tag, member.user.avatarURL({ dynamic: true }))
            .setDescription(`Bienvenido ${member} a Apolo Security, ten una linda estancia y espero que tus servidores queden protegidos todo el tiempo :)\n > Puedes pasarte por los canales <#901602785236221952> y <#900776507264368670> para estar bien informado\n\n \`Att: Apolo Security\``)
            .setColor("AQUA")
            .setTimestamp()
            channel.send({ content: `${member}`, embeds: [embed] });
         }
     }
}