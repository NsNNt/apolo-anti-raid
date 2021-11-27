const Blacklist = require("../../Models/Blacklist");
const Malicious = require("../../Models/Malicious");
const { Client, GuildMember, MessageEmbed } = require("discord.js");

module.exports = {
    name: "guildMemberAdd",
    /**
     * 
     * @param {GuildMember} member 
     * @param {Client} client 
     */
    async execute(member, client) {
        const { guild } = member;
        const { user } = member;
        const userblk = await Blacklist.findOne({ userId: user?.id });
        const malicious = await Malicious.findOne({ guildId: guild.id });
        if(userblk) {
            if(!malicious) {
                return;
            }
            if(!malicious?.actived) {
                return;
            }
            if(malicious?.punishment === "Marcar") {
                member.edit({
                    nick: userblk.razon
                }).catch(e => {});
                client.users.cache.get(guild.ownerId).send({
                    "embeds": [
                        {
                          "title": "`📢⛔` - Detección de maliciosos",
                          "description": "`{📢}` **|** He detectado a `"+user.tag+"` como un usuario malicioso, la razón de la blacklist que encontre es: `"+userblk.razon+"`.\n`{✅}` **|** Logre `Marcar` al sujeto con exito!\n\n`-` Enviado desde: `"+guild.name+"`",
                          "url": "https://discord.gg/tPWYAPhhwz",
                          "color": 9215,
                          "footer": {
                            "text": "Apolo Security"
                          },
                          "timestamp": Date.now()
                        }
                    ]
                }).catch(e => {});
                malicious.lastMaliciousDetected = user.tag;
                await malicious.save();
            } else if(malicious?.punishment === "Expulsar") {
                if(member.kickable) {
                    member.kick('Anti-Maliciosos activado.');
                    client.users.cache.get(guild.ownerId).send({
                        "embeds": [
                            {
                              "title": "`📢⛔` - Detección de maliciosos",
                              "description": "`{📢}` **|** He detectado a `"+user.tag+"` como un usuario malicioso, la razón de la blacklist que encontre es: `"+userblk.razon+"`.\n`{✅}` **|** Logre `Expulsar` al sujeto con exito!\n\n`-` Enviado desde: `"+guild.name+"`",
                              "url": "https://discord.gg/tPWYAPhhwz",
                              "color": 9215,
                              "footer": {
                                "text": "Apolo Security"
                              },
                              "timestamp": Date.now()
                            }
                        ]
                    }).catch(e => {});
                    malicious.lastMaliciousDetected = user.tag;
                    await malicious.save();
                } else {
                    return;
                }
            } else if(malicious?.punishment === "Banear") {
                if(member.bannable) {
                    member.ban({
                        reason: 'Anti-Maliciosos activado.'
                    });
                    client.users.cache.get(guild.ownerId).send({
                        "embeds": [
                            {
                              "title": "`📢⛔` - Detección de maliciosos",
                              "description": "`{📢}` **|** He detectado a `"+user.tag+"` como un usuario malicioso, la razón de la blacklist que encontre es: `"+userblk.razon+"`.\n`{✅}` **|** Logre `Banear` al sujeto con exito!\n\n`-` Enviado desde: `"+guild.name+"`",
                              "url": "https://discord.gg/tPWYAPhhwz",
                              "color": 9215,
                              "footer": {
                                "text": "Apolo Security"
                              },
                              "timestamp": Date.now()
                            }
                        ]
                    }).catch(e => {});
                    malicious.lastMaliciousDetected = user.tag;
                    await malicious.save();
                } else {
                    return;
                }
            } else {
                return;
            }
        }
    }
}
