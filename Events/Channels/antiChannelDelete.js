const { Client, GuildMember, MessageEmbed, GuildChannel } = require("discord.js");
const AntiChannels = require("../../Models/AntiChannels");
const Whitelist = require("../../Models/Whitelist");

module.exports = {
    name: "channelDelete",
    /**
     * @param {Client} client
     * @param {GuildChannel} channel
     */
    async execute(channel) {
        const anticanales = await AntiChannels.findOne({ guildId: channel.guild.id });
        const {guild} = channel;
        if(!anticanales) {
            return;
        } else {
            if(anticanales?.actived) {
                const auditlogs = await channel.guild.fetchAuditLogs({
                    type: "CHANNEL_DELETE",
                    limit: 1
                }).catch(e => {});
                const { executor } = auditlogs.entries.first();
                if(executor.bot) {
                    if(executor.flags.has("VERIFIED_BOT")) {
                        return;
                    } else {
                        if(executor.id === "901344194579279882") {
                            return;
                        } else {
                            let name = channel.name;
                            let nsfw = channel.nsfw;
                            let parent = channel.parent;
                            let type = channel.type;
                            let position = channel.position;
                            const ch = await channel.guild.channels.create(name, {
                                nsfw: nsfw,
                                type: type
                            });
                            const parentNew = await channel.guild.channels.cache.find(c => c.name === parent?.name && c.type === "GUILD_CATEGORY")
                            ch.setParent(parentNew?.id);
                            ch.setPosition(position);
                        }
                    }
                } else {
                    const Target = channel.guild.members.cache.get(executor.id);
                    const uW = await Whitelist.findOne({
                        guildId: guild.id,
                        userId: Target?.id
                    });
                    if(uW) {
                        return;
                    }
                    if(Target) {
                        if(channel.guild.me.roles.highest.comparePositionTo(Target?.roles.highest) <= 0) {
                            return;
                        } 
                    }
                    if(channel.guild.ownerId === Target?.id) {
                        return;
                    } else {
                        let name = channel.name;
                            let nsfw = channel.nsfw;
                            let parent = channel.parent;
                            let type = channel.type;
                            let position = channel.position;
                            const ch = await channel.guild.channels.create(name, {
                                nsfw: nsfw,
                                type: type
                            });
                            if(parent) {
                                const parentNew = await channel.guild.channels.cache.find(c => c.name === parent?.name && c.type === "GUILD_CATEGORY")
                                ch.setParent(parentNew?.id);
                                ch.setPosition(position);
                            }
                    }
                }
            } else {
                return;
            }
        }
    }
}