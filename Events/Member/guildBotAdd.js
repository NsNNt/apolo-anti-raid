const { Client, GuildMember, MessageEmbed } = require("discord.js");
const AntiBots = require("../../Models/AntiBots");
const emojis = require("../../emojis");

module.exports = {
    name: "guildMemberAdd",
    /**
     * @param {Client} client
     * @param {GuildMember} member
     */
     async execute(member) {
         if(member.user.bot) {
             const antibots = await AntiBots.findOne({ guildId: member.guild.id });
             if(!antibots) {
                 return;
             } else {
                if(antibots?.actived) {
                    console.log(`Añadieron un bot a ${member.guild.name}, el cual es ${member.user.tag}`)
                    try {
                        const audit = await member.guild.fetchAuditLogs({
                            type: "BOT_ADD"
                        });
                        const { executor, target } = audit.entries.first();
                        const Executor = member.guild.members.cache.get(executor.id);
                        const Target = member.guild.members.cache.get(target.id);
                        if(executor.id === member.guild.ownerId) {
                            return;
                        }
                        if(member.guild.me.roles.highest.comparePositionTo(Executor.roles.highest) <= 0) {
                            return;
                        }
                        const Embed = new MessageEmbed()
                        .setAuthor(member.guild.name, member.guild.iconURL({ dynamic: true }))
                        .setDescription(`${emojis.escudo} \`${Executor.user.tag}\` | ${Executor.id} añadio un bot a ${member.guild.name}\n\n${emojis.moderacion} __He logrado banear al usuario y el bot correctamente__\nUsuario: ${Executor.user.tag} | ${Executor.id}\nBot: ${Target.user.tag} | ${Target.id}`)
                        .setColor("BLUE")
                        .setTimestamp()
    
                        member.guild.members.cache.get(member.guild.ownerId).send({ embeds: [Embed] });
                        member.guild.members.ban(Target, {
                            reason: "Anti-Bots activado"
                        }).catch(e => {});
                        member.guild.members.ban(Executor, {
                            reason: "Anti-Bots activado"
                        }).catch(e => {});
                    } catch (e) {

                    }
                } else {
                    return;
                }
            }
         } else {}
     }
}