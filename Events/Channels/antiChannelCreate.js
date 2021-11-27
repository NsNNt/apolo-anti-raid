const { Client, GuildMember, MessageEmbed, GuildChannel } = require("discord.js");
const AntiChannels = require("../../Models/AntiChannels");
const Whitelist = require("../../Models/Whitelist");

module.exports = {
    name: "channelCreate",
    /**
     * @param {Client} client
     * @param {GuildChannel} channel
     */
    async execute(channel) {
        const anticanales = await AntiChannels.findOne({ guildId: channel.guild.id });
        const { guild } = channel;
        if(!anticanales) {
            return;
        } else {
            if(anticanales?.actived) {
                const auditlogs = await channel.guild.fetchAuditLogs({
                    type: "CHANNEL_CREATE",
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
                            channel.delete("Anti-Canales activado").catch(e => {});
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
                        channel.delete("Anti-Canales activado").catch(e => {});
                    }
                }
            } else {
                return;
            }
        }
    }
}