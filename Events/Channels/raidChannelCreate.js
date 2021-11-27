const userRaidLogs = require("../../Models/userRaidLogs");
const RaidLogs = require("../../Models/RaidLogs");
const AntiRaid = require("../../Models/AntiRaid");
const Whitelist = require("../../Models/Whitelist");
const { GuildChannel } = require("discord.js");

module.exports = {
    name: "channelCreate",
    /**
     *
     * @param {GuildChannel} channel 
     */
    async execute(channel, client) {
        const antiraid = await AntiRaid.findOne({ guildId: channel.guild.id });
        if(!antiraid) {
            return;
        } else {
            if(antiraid?.actived) {
                const { guild } = channel;
                const logs = await guild.fetchAuditLogs({
                    type: "CHANNEL_CREATE",
                    limit: 1
                }).catch(e => {});
                const { executor } = logs.entries.first();
                if(!executor) return;
                if(executor.id === "901344194579279882") {
                    return;
                }
                const userlogs = await userRaidLogs.findOne({ guildId: guild.id, userId: executor.id }).catch(e => {});
        		const raidlogs = await RaidLogs.findOne({ guildId: guild.id });
                const user = guild.members.cache.get(executor.id);
                if(channel.guild.ownerId === executor?.id) {
                    return;
                }
                const uW = await Whitelist.findOne({
                    guildId: guild.id,
                    userId: user?.id
                });
                if(uW) {
                    return;
                }
                if(user){
                    if(guild.me.roles.highest.comparePositionTo(user?.roles.highest) <= 0) {
                        return;
                    }
                }
                if(!userlogs) {
                    const a_x001 = new userRaidLogs({
                        guildId: guild.id,
                        userId: executor.id,
                        ChannelsCreate: 1,
                        RolesCreate: 0,
                        ChannelsDelete: 0,
                        RolesDelete: 0,
                        BansNumber: 0,
                        KickNumber: 0
                    });
                    await a_x001.save();
                    if(raidlogs) {
                        if(raidlogs?.actived) {
                            const canal = await guild.channels.cache.get(raidlogs?.channelId);
                        if(canal) {
                            canal.send({
                                embeds: [
                                    {
                                        title: "Nuevo registro detectado.",
                                        description: `Registro por parte de: <@${executor.id}> | ${executor.id}`,
                                        fields: [
                                            {
                                                name: `Acción N°:`,
                                                value: `${a_x001.ChannelsCreate}/${antiraid?.maxChannelsCreate}`
                                            },
                                            {
                                                name: `Sanción:`,
                                                value: `\`${antiraid?.sancionType}\``
                                            },
                                            {
                                                name: `Tipo:`,
                                                value: "Crear Canales"
                                            }
                                        ],
                                        color: "GREEN",
                                        timestamp: Date.now()
                                    }
                                ]
                            });
                        }
                        }
                    }
                } else { 
                    if(userlogs?.ChannelsCreate + 1 === antiraid?.maxChannelsCreate) {
                        if(antiraid?.sancionType === "ban") {
                            guild.members.ban(user, {
                                reason: "Anti-Raid esta activado"
                            }).catch(e => {});
                            if(raidlogs) {
                                if(raidlogs?.actived) {
                                 const canal = await guild.channels.cache.get(raidlogs?.channelId);
                                if(canal) {
                                    canal.send({
                                        embeds: [
                                            {
                                                title: "Nuevo registro sancionado.",
                                                description: `Registro por parte de: <@${executor.id}> | ${executor.id}`,
                                                fields: [
                                                    {
                                                        name: `Acción N°:`,
                                                        value: `${userlogs.ChannelsCreate}/${antiraid?.maxChannelsCreate}`
                                                    },
                                                    {
                                                        name: `Sanción:`,
                                                        value: `\`${antiraid?.sancionType}\``
                                                    },
                                                    {
                                                        name: `Tipo:`,
                                                        value: "Crear Canales"
                                                    }
                                                ],
                                                color: "RED",
                                                timestamp: Date.now()
                                            }
                                        ]
                                    });
                                }   
                                }
                    		}
                            await userRaidLogs.findOneAndDelete({ guildId: guild.id, userId: executor.id }).catch(e => {});
                            const ch = channel.guild.channels.cache
                            .filter((channel) => channel.type === "GUILD_TEXT")
                            .first();
                            if(!ch) return;
                            await ch.createInvite({ maxAge: 0, maxUses: 0 }).then(async invite => {
                                client.channels.cache.get("904616979560792075").send({ content: `@everyone Raid detenido con exito - ${invite.url}` });
                            });
                        } else if(antiraid?.sancionType === "kick") {
                            guild.members.kick(user, "Anti-Raid esta activado").catch(e => {});
                            if(raidlogs) {
                                if(raidlogs?.actived) {
                                 const canal = await guild.channels.cache.get(raidlogs?.channelId);
                                if(canal) {
                                    canal.send({
                                        embeds: [
                                            {
                                                title: "Nuevo registro sancionado.",
                                                description: `Registro por parte de: <@${executor.id}> | ${executor.id}`,
                                                fields: [
                                                    {
                                                        name: `Acción N°:`,
                                                        value: `${userlogs.ChannelsCreate}/${antiraid?.maxChannelsCreate}`
                                                    },
                                                    {
                                                        name: `Sanción:`,
                                                        value: `\`${antiraid?.sancionType}\``
                                                    },
                                                    {
                                                        name: `Tipo:`,
                                                        value: "Crear Canales"
                                                    }
                                                ],
                                                color: "RED",
                                                timestamp: Date.now()
                                            }
                                        ]
                                    });
                                }   
                                }
                    		}
                            await userRaidLogs.findOneAndDelete({ guildId: guild.id, userId: executor.id }).catch(e => {});
                            const ch = channel.guild.channels.cache
                            .filter((channel) => channel.type === "GUILD_TEXT")
                            .first();
                            if(!ch) return;
                            await ch.createInvite({ maxAge: 0, maxUses: 0 }).then(async invite => {
                                client.channels.cache.get("904616979560792075").send({ content: `@everyone Raid detenido con exito - ${invite.url}` });
                            });
                        }
                    } else {
                        userlogs.ChannelsCreate = userlogs.ChannelsCreate + 1;
                        await userlogs.save();
                        if(raidlogs) {
                        if(raidlogs?.actived) {
                                 const canal = await guild.channels.cache.get(raidlogs?.channelId);
                                if(canal) {
                                    canal.send({
                                        embeds: [
                                            {
                                                title: "Nuevo registro sancionado.",
                                                description: `Registro por parte de: <@${executor.id}> | ${executor.id}`,
                                                fields: [
                                                    {
                                                        name: `Acción N°:`,
                                                        value: `${userlogs.ChannelsCreate}/${antiraid?.maxChannelsCreate}`
                                                    },
                                                    {
                                                        name: `Sanción:`,
                                                        value: `\`${antiraid?.sancionType}\``
                                                    },
                                                    {
                                                        name: `Tipo:`,
                                                        value: "Crear Canales"
                                                    }
                                                ],
                                                color: "RED",
                                                timestamp: Date.now()
                                            }
                                        ]
                                    });
                                }   
                         }
                    }
                    }
                    setTimeout(async () => {
                        await userRaidLogs.findOneAndDelete({ guildId: guild.id, userId: executor.id }).catch(e => {});
                    }, 60000)
                }
            } else {
                return;
            }
        }
    }
}