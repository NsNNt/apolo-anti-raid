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
        const isMuted = await Muted.findOne({ userId: member.user.id, guildId: member.guild.id });
        const MuteRole = await MutedRole.findOne({ guildId: member.guild.id });
        if(isMuted) {
           if(MuteRole) {
               const Role = member.guild.roles.cache.get(MuteRole.roleId);
               if(Role) {
                  member.roles.add(Role).then(() => {
                     member.send({ content: `<@${member.user.id}>, Estas muteado en \`${member.guild.name}\` el rol tiene persistencia.` }).catch(e => {});
                  });
               } else {
                  return;
               }
           } else {
              return;
           }
        }
     }
}