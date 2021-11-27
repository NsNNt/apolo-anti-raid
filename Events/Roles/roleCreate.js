const { MessagEmbed, Role, Client } = require("discord.js");
const AntiRoles = require("../../Models/AntiRoles");
const Whitelist = require("../../Models/Whitelist");

module.exports = {
    name: "roleCreate",
    /**
     * @param {Client} client
     * @param {Role} role
     */
    async execute(role) {
        const { guild } = role;
        const antiroles = await AntiRoles.findOne({ guildId: guild.id });
        if(!antiroles) {
            return;
        } else {
            if(antiroles?.actived) {
                try {
                    const auditlogs = await guild.fetchAuditLogs({
                        type: "ROLE_CREATE"
                    }).catch(e => {});
                    const { executor } = auditlogs.entries.first();
                    if(executor.bot) {
                        if(executor.flags.has("VERIFIED_BOT")) {
                            return;
                        } else {
                            if(executor.id === "901344194579279882") {
                                return;
                            }
                        }
                    } else {
                        try {
                            const Target = guild.members.cache.get(executor.id);
                            const uW = await Whitelist.findOne({
                                guildId: guild.id,
                                userId: Target?.id
                            });
                            if(uW) {
                                return;
                            }
                            if(Target) {
                                if(guild.me?.roles?.highest?.comparePositionTo(Target?.roles?.highest) <= 0) {
                                    return;
                                } else if(role.guild.ownerId === Target?.id) {
                                    return;
                                }
                            }
                            role.delete().catch(e => {});
                        } catch (e) {
                            console.log(e)
                        }
                    }
                } catch (e) {
                    
                }
            }
        }
    }
}