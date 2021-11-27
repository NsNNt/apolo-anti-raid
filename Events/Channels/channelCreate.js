const { Client, GuildMember, MessageEmbed, GuildChannel } = require("discord.js");
const MutedRole = require("../../Models/MutedRole");

module.exports = {
    name: "channelCreate",
    /**
     * @param {Client} client
     * @param {GuildChannel} channel
     */
    async execute(channel) {
        const muterole = await MutedRole.findOne({ guildId: channel.guild.id });
        if(!muterole) {
            return;
        }
        const Target = channel.guild.roles.cache.get(muterole.roleId);
        if(!Target) {
            return;
        }
        channel.permissionOverwrites.edit(Target, {
            SEND_MESSAGES: false,
            ADD_REACTIONS: false,
            CREATE_PUBLIC_THREADS: false,
            CREATE_PRIVATE_THREADS: false,
            SEND_MESSAGES_IN_THREADS: false
        });
    }
}