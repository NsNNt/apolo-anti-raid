const { MessageEmbed, MessageActionRow, Message, MessageButton } = require("discord.js");
const emojis = require("../../emojis");
const Whitelist = require("../../Models/Whitelist");

module.exports = {
    name: "whitelist",
    aliases: ["autorizados"],
    description: "Este comando crea una inmunidad hacia el rol/usuario que eligas",
    usage: "whitelist <añadir/remover/lista> [@Usuario]",
    cooldown: 5,
    permissions: "OWNER",
    /**
     * @param {Message} message
     * @param {string[]} args
     */
    async execute(message, args, commandName, client, Discord, prefix) {
        if(message.guild.ownerId !== message.author.id) {
            return message.reply({ content: `Solo el __propietario__ de este servidor puede usar esto.`, allowedMentions: { repliedUser: false } });
        } else {
            if(!message.guild.me.permissions.has("ADMINISTRATOR")) {
                return message.reply({ content: `No puedo interactuar con este servidor sin los siguientes permisos: \`ADMINISTRADOR\``, allowedMentions: { repliedUser: false } });
            }
            const actions = ["añadir", "remover", "lista"];
            const action = args[0];
            if(!action) {
                return message.channel.send({ content: "Las acciones disponibles son: `añadir`, `remover`, `lista`" })
            }
            if(!actions.includes(action.toLowerCase())) {
                return message.channel.send({ content: `La acción \`${action}\` no esta disponible.` });
            }
            if(action.toLowerCase() === "lista") {
                const list = await Whitelist.find({ guildId: message.guild.id });
                let whitelisted;
                if(list.length <= 0) {
                    whitelisted = "> `✅` **-** `No hay usuarios en esta lista!`"
                } else {
                    whitelisted = list.map((u, i) => {
                        const user = message.guild.members.cache.get(u.userId);
                        return `> \`${i + 1}.\` | <@!${user.id}> | \`${user.id}\` | \`${user.user.tag}\``
                    }).join("\n");
                }
                message.channel.send({
                    "embeds": [
                        {
                          "title": "`📰` - Lista completa de usuarios:",
                          "description": `${whitelisted}`,
                          "url": "https://discord.gg/tPWYAPhhwz",
                          "color": 9215,
                          "fields": [
                            {
                              "name": "`❔` - ¿Qué es esto?",
                              "value": "Aqui estan los usuarios que no se registraran logs como: `Eliminar Canales`, `Crear Canales`, `Banear Miembros`, `etc`."
                            },
                            {
                              "name": "`👑` - ¿Cómo elimino a alguien?",
                              "value": "Utiliza el comando `"+prefix+"whitelist remover <Id/@Usuario>`"
                            }
                          ],
                          "footer": {
                            "text": "Apolo Security"
                          },
                          "timestamp": Date.now()
                        }
                    ]
                });
            } else if(action.toLowerCase() === "añadir") {
                const usuario = message.mentions.members.first() || message.guild.members.cache.get(args[1]);
                if(!usuario) {
                    return message.channel.send({ content: "No proporcionaste ningun usuario." });
                } else {
                    const isIn = await Whitelist.findOne({ guildId: message.guild.id, userId: usuario.id });
                    if(isIn) {
                        return message.channel.send({ content: "Ese usuario ya esta en la lista blanca." });
                    }
                    const nWU = new Whitelist({
                        guildId: message.guild.id,
                        userId: usuario.id
                    });
                    await nWU.save();
                    message.channel.send({ content: `${usuario} añadido a la lista blanca.` });
                }
            } else if(action.toLowerCase() === "remover") {
                const usuario = message.mentions.members.first() || message.guild.members.cache.get(args[1]);
                if(!usuario) {
                    return message.channel.send({ content: "No proporcionaste ningun usuario." });
                } else {
                    const isIn = await Whitelist.findOne({ guildId: message.guild.id, userId: usuario.id });
                    if(!isIn) {
                        return message.channel.send({ content: "Ese usuario no esta en la lista blanca." });
                    }
                    await Whitelist.findOneAndDelete({ guildId: message.guild.id, userId: usuario.id });
                    message.channel.send({ content: `${usuario} removido de la lista blanca.` });
                }
            }
        }
    }
}