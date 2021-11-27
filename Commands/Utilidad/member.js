const { MessageEmbed, MessageActionRow, Message, MessageButton } = require("discord.js");
const Blacklist = require("../../Models/Blacklist");
const Staff = require("../../Models/Staff");
const emojis = require("../../emojis");
const moment = require("moment");

module.exports = {
    name: "member",
    aliases: ["user"],
    usage: "member {info/staff/blacklist} @Usuario",
    description: "Información útil de un usuario",
    cooldown: 3,
    /**
     * @param {Message} message
     */
    async execute(message, args, commandName, client, Discord, prefix) {
        const actions = ['info', 'staff', 'blacklist'];
        const action = args[0];
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[1]);
        if(!member) {
            return message.channel.send({
                "content": null,
                "embeds": [
                  {
                    "title": "Usuario invalido.",
                    "description": "El uso correcto de este comando es `"+prefix+"member {info/staff/blacklist} <@Usuario>`\n\n`[*]` **|** Para más información de este usa `"+prefix+"command member`",
                    "color": 16724016
                  }
                ]
              })
        }
        if(!actions.some(a => a === action.toLowerCase())) {
            return message.channel.send({ content: `La acción \`${action}\` no esta disponible.` });
        } else {
            if(action.toLowerCase() === "info") {
                let status;
                let mStatus = member.presence?.status;
                if(!mStatus) {
                    status = "Invisible"
                } else if(mStatus === "dnd") {
                    status = "No molestar"
                } else if(mStatus === "online") {
                    status = "Conectado"
                } else if(mStatus === "idle") {
                    status = "Ausente"
                }

                message.channel.send({
                    "content": null,
                    "embeds": [
                      {
                        "title": "__Información de usuario__",
                        "description": `\`[👤]\` **Credenciales:\n** \`${member.user.tag} | ID: ${member.id}\``,
                        "color": member.roles.highest.hexColor,
                        "fields": [
                          {
                            "name": "`[+]` En Discord desde:",
                            "value": `<t:${parseInt(member.user.createdTimestamp / 1000)}:R>`
                          },
                          {
                            "name": "`[+]` Miembro del servidor desde:",
                            "value": `<t:${parseInt(member.joinedAt / 1000)}:R>`
                          },
                          {
                            "name": "`[?]` Este usuario es un bot:",
                            "value": `${member.user.bot ? "El usuario esta marcado como un `bot`" : "El usuario no esta marcado como `bot`"}`
                          },
                          {
                            "name": "`[*]` Estado:",
                            "value": `\`${status}\``
                          },
                          {
                            "name": "`[-]` Roles",
                            "value": `${member.roles.cache.map(r => r.toString()).join(" ").replace('@everyone', ' ')}`
                          }
                        ],
                        "thumbnail": {
                          "url": `${member.displayAvatarURL({ dynamic: true })}`
                        }
                      }
                    ]
                  })
            } else if(action.toLowerCase() === "staff") {
                const staff = await Staff.findOne({ userId: member.id });
                if(!staff) {
                    return message.channel.send({ content: `El usuario \`${member.user.tag}\` no es un staff de mi soporte!` });
                } else {
                    return message.channel.send({ content: `El usuario \`${member.user.tag}\` es staff en mi soporte.` });
                }
            } else if(action.toLowerCase() === "blacklist") {
                const blk = await Blacklist.findOne({ userId: member.id });
                if(!blk) {
                    return message.channel.send({ content: `${member} No es un usuario en blacklist!` });
                } else {
                    return message.channel.send({ content: `${member} Es un usuario malicioso, razón: \`${blk?.razon}\`` });
                }
            }
        }
    }
}