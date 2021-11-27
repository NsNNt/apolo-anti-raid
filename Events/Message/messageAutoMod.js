const { Client, Message, MessageEmbed, Collection } = require("discord.js");
const AutoMod = require("../../Models/AutoModerador");
const MutedRole = require("../../Models/MutedRole");
const Muted = require("../../Models/Muted");

let warns = [];
const muteInterval = 10000;

module.exports = {
    name: "messageCreate",
    /**
     * 
     * @param {Message} message 
     * @param {Client} client 
     */
    async execute(message, client) {
        if(!message.guild) return;
        if(message.author.bot) return;
        if(message.content.toLowerCase().includes("cnd.discordapp")) return;
        if(message.content.toLowerCase().includes("media.discordapp")) return;
        const automod = await AutoMod.findOne({ guildId: message.guild.id });
        const mutedrole = await MutedRole.findOne({ guildId: message.guild.id });
        if(!automod && !mutedrole) {
            return;
        } else {
            if(automod?.actived) {
                const Role = message.guild.roles.cache.get(mutedrole.roleId);
                if(!Role) {
                    return;
                }
                if(!message.guild.me.permissions.has("ADMINISTRATOR")) {
                    return;
                }
                if(message.member?.permissions.has("ADMINISTRATOR")) {
                    return;
                }
                const links = ["discord.gg", "discordapp.com/invite", "discord.com/invite"];
                if(links.some(link => message.content.toLowerCase().includes(link))) {
                    const userWarns = warns.filter(w => w.author.id === message.author.id)
                    message.delete().catch(e => {});
                    warns.push({
                        author: {
                            id: message.author.id,
                            tag: message.author.tag
                        }
                    });
                    message.channel.send({ content: `${message.author}, Si sigues haciendo spam te tendre que sancionar` }).then(msg => {
                        setTimeout(() => {
                            msg.delete().catch(e => {});
                        }, 5000);
                    });
                    if(userWarns.length + 1 === automod?.maxWarnMute) {
                        message.delete().catch(e => {});
                        message.member?.roles.add(Role.id).then(async () => {
                            const createMuted = new Muted({
                                guildId: message.guild.id,
                                userId: message.author.id
                            });
                            await createMuted.save();
                            setTimeout(async () => {
                                message.member?.roles.remove(Role.id).catch(e => {});
                                await Muted.findOneAndDelete({ guildId: message.guild.id, userId: message.author.id }).catch(e => {});
                            }, 600000);
                        }).catch(e => {});
                        message.channel.send({ content: `${message.author}, Fuiste muteado durante \`10m\` por \`Spam\`` }).then(msg => {
                        		setTimeout(() => {
                            		msg.delete().catch(e => {});
                        		}, 10000);
                    		});
                    }
                    if(userWarns.length + 1 === automod?.maxWarnKick) {
                        message.delete().catch(e => {});
                        message.guild.members.kick(message.member, `Auto-Moderador: ${automod?.maxWarnKick} warns sobrepasados.`);
                        message.channel.send({ content: `${message.author}, Fuiste expulsado por \`Spam\`` }).then(msg => {
                        		setTimeout(() => {
                            		msg.delete().catch(e => {});
                        		}, 10000);
                    		});
                    } 
                    if(userWarns.length + 1 === automod?.maxWarnBan) {
                        message.delete().catch(e => {});
                        message.guild.members.ban(message.member, {
                            reason: `Auto-Moderador: ${automod?.maxWarnBan} warns sobrepasados.`
                        });
                        message.channel.send({ content: `${message.author}, Fuiste baneado por \`Spam\`` }).then(msg => {
                        		setTimeout(() => {
                            		msg.delete().catch(e => {});
                        		}, 10000);
                    		});
                        warns = [];
                    }
                }
            }
        }
    }
}