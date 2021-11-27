const { Client, Message, MessageEmbed, Collection } = require("discord.js");
const AutoMod = require("../../Models/AutoModerador");
const MutedRole = require("../../Models/MutedRole");
const Muted = require("../../Models/Muted");
const ModLogs = require("../../Models/modLogs");

let warns = [];
let messages = [];
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
                let msgs = messages.filter(m => m.author.id === message.author.id);
                const userWarns = warns.filter(w => w.author.id === message.author.id)
                if(msgs.length + 1 === 4) {
                    warns.push({
                        author: {
                            id: message.author.id,
                            tag: message.author.tag
                        }
                    });
                    message.channel.send({ content: `${message.author}, si sigues haciendo flood tendre que sancionarte.` }).then(msg => {
                        setTimeout(() => {
                            msg.delete().catch(e => {});
                        }, 5000);
                    });
                    if(userWarns.length + 1 === automod?.maxWarnMute) {
                        let mToD = await message.channel.messages.fetch({
                            limit: 100
                        });
                        let msToD = mToD.filter(m => m.author.id === message.author.id);
                        message.channel.bulkDelete(msToD, true);
                        message.member?.roles.add(Role.id).then(async () => {
                            message.channel.send({ content: `${message.author} fuiste muteado durante \`10m\` por \`Muchos mensajes en 7s\`` }).then(msg => {
                        		setTimeout(() => {
                            		msg.delete().catch(e => {});
                        		}, 10000);
                    		});
                            const createMuted = new Muted({
                                guildId: message.guild.id,
                                userId: message.author.id
                            });
                            await createMuted.save();
                            setTimeout(async () => {
                                message.member?.roles.remove(Role.id).catch(e => {});
                                await Muted.findOneAndDelete({ guildId: message.guild.id, userId: message.author.id }).catch(e => {});
                            }, 600000);
                        });
                    } else if(userWarns.length + 1 === automod?.maxWarnKick) {
                        let mToD = await message.channel.messages.fetch({
                            limit: 100
                        });
                        let msToD = mToD.filter(m => m.author.id === message.author.id);
                        message.channel.bulkDelete(msToD, true);
                        message.guild.members.kick(message.member, "Auto-Moderador: Muchos mensajes en 7s.").then(msg => {
                        		setTimeout(() => {
                            		msg.delete().catch(e => {});
                        		}, 10000);
                    		}).catch(e => {});
                        message.channel.send({ content: `${message.author} fue expulsado por: \`Flood Masivo en 7s\`` });
                    } else if(userWarns.length + 1 >= automod?.maxWarnBan) {
                        let mToD = await message.channel.messages.fetch({
                            limit: 100
                        });
                        let msToD = mToD.filter(m => m.author.id === message.author.id);
                        message.channel.bulkDelete(msToD, true);
                        message.guild.members.ban(message.member, {
                            reason: "Auto-Moderador: Muchos mensajes en 7s."
                        }).catch(e => {});
                        message.channel.send({ content: `${message.author} fue baneado por: \`Flood Masivo en 7s\`` }).then(msg => {
                        		setTimeout(() => {
                            		msg.delete().catch(e => {});
                        		}, 10000);
                    		});
                        warns = [];
                    }
                } else {
                    messages.push({
                        author: {
                            id: message.author.id
                        },
                        content:  message.content
                    });
                }
                setTimeout(() => {
                    messages = [];
                }, 7000);
            }
        }
    }
}