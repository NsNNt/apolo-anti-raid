const { GuildMember } = require("discord.js");
const AntiTokens = require("../../Models/AntiTokens");
let tokens = [];

module.exports = {
    name: "guildMemberAdd",
    /**
     * 
     * @param {GuildMember} member 
     */
    async execute(member) {
        const { guild } = member;
        const antitokens = await AntiTokens.findOne({ guildId: guild?.id });
        if(!antitokens) {
            return;
        } else {
            if(!antitokens?.actived) {
                return;
            } else {
                const gMember = guild.members.cache;
                const user = gMember.find(us => us.user.username == member.user.username);
                if(user) {
                    tokens.push(member)
                    if(tokens.length >= 3) {
                        member.guild.members.ban(member, {
                            reason: "Posible token/multicuenta detectado"
                        });
                        member.send({ content: "Mi sistema te detecto como posible token/multicuenta, fuiste baneado de `"+guild.name+"`." }).catch(e => {});

                    }
                }
                setTimeout(() => {
                    tokens = [];
                }, 60000);
            }
        }
    }
}