const { MessageEmbed, MessageActionRow, Message, MessageButton } = require("discord.js");
const Prefix = require("../../Models/Prefix");
const emojis = require("../../emojis");

module.exports = {
    name: "setprefix",
    aliases: ["setprefijo", "set-prefix"],
    description: "Coloca un prefix personalizado en tu servidor",
    permissions: "MANAGE_GUILD",
    usage: "setprefix <Prefix>",
    cooldown: 5,
    /**
     * @param {Message} message
     */
    async execute(message, args, commandName, client, Discord) {
        if(!message.member.permissions.has("MANAGE_GUILD")) {
            return message.reply({ content: `${emojis.negativo} | \`No tienes permisos para ejecutar esta acción\` `, allowedMentions: { repliedUser: false } });
        }
        const prefixExists = await Prefix.findOne({ guildId: message.guild.id });
        const prefix = args[0];
        if(!prefixExists) {
            if(!prefix) {
                return message.reply({ content: `${emojis.negativo} | \`No proporcionaste ningun prefix\``, allowedMentions: { repliedUser: false } })
            } else {
                const createNewPrefix = new Prefix({
                    guildId: message.guild.id,
                    prefix: prefix
                });
                await createNewPrefix.save();
                return message.reply({ content: `${emojis.positivo} | \`El prefix fue actualizado correctamente a ${prefix}\``, allowedMentions: { repliedUser: false } });
            }
        } else {
            prefixExists.prefix = prefix;
            await prefixExists.save();
            return message.reply({ content: `${emojis.positivo} | \`El prefix fue actualizado correctamente a ${prefix}\``, allowedMentions: { repliedUser: false } });
        }
    }
}