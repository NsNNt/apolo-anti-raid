const { MessagEmbed, Role, Client } = require("discord.js");
const AntiRoles = require("../../Models/AntiRoles");
const Whitelist = require("../../Models/Whitelist");

module.exports = {
    name: "roleDelete",
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
                        type: "ROLE_DELETE"
                    }).catch(e => {});
                    const { executor } = auditlogs.entries.first();
                    if(executor.bot) {
                        if(executor.flags.has("VERIFIED_BOT")) {
                            return;
                        } else {
                            if(executor.id === "901344194579279882") {
                                return;
                            }
                            try {
                                const Target = guild.members.cache.get(executor.id);
                                const name = role.name;
                                const position = role.position;
                                const color = role.color;
                                const permissions = role.permissions;
                                const rol = await guild.roles.create(name);
                                rol.setName(name);
                                rol.setColor(color);
                                rol.setPosition(position);
                                rol.setPermissions(permissions);
                            } catch (e) {
                                console.log(e)
                            }
                        }
                    } else {
                        if(executor.id === "901344194579279882") {
                            return;
                        }
                        try {
                            const Target = guild.members.cache.get(executor.id);
                            const uW = await Whitelist.findOne({
                                guildId: guild.id,
                                userId: Target?.id
                            });
                            if(uW) {
                                return;
                            }
                            const name = role.name;
                            const position = role.position;
                            const color = role.color;
                            const permissions = role.permissions;
                            if(Target) {
                                if(guild.me?.roles?.highest?.comparePositionTo(Target?.roles?.highest) <= 0) {
                                    return;
                                } else if(role.guild.ownerId === Target?.id) {
                                    return;
                                }
                            }
                            const rol = await guild.roles.create(name);
                            rol.setName(name);
                            rol.setColor(color);
                            rol.setPosition(position);
                            rol.setPermissions(permissions);
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