const { MessageEmbed, MessageActionRow, Message, MessageButton } = require("discord.js");
const emojis = require("../../emojis");
const Perms = require("../../Models/ModPerms");

module.exports = {
    name: "purge",
    aliases: ["clear", "prune"],
    description: "Limpia mensajes de el canal en donde se ejecute el comando",
    usage: "purge <Número>",
    permissions: "MANAGE_MESSAGES",
    cooldown: 5,
    /**
     * @param {Message} message
     */
    async execute(message, args, commandName, client, Discord) {
        const userRoles = message.member.roles.cache;
        const findRolePerm = await Perms.find({ guildId: message.guild.id });
        let RolePerm;
        findRolePerm.some(d => {
            const role = userRoles.find(r => r.id === d.roleId);
            if(role) {
                RolePerm = role?.id
            }
        });
        const findPerms = await Perms.findOne({ guildId: message.guild.id, roleId: RolePerm });
        if(findPerms?.allowed.includes(commandName) && !findPerms?.denied.includes(commandName)) {
            if(!message.guild.me.permissions.has("MANAGE_MESSAGES")) {
                return message.reply({ content: `No puedo interactuar con este servidor sin los siguientes permisos: \`MANAGE_MESSAGES\``, allowedMentions: { repliedUser: false } });
            }
            const messagesToClear = args[0];
            if(!messagesToClear) {
                return message.reply({ content: `${emojis.negativo} | No puedo limpiar \`0\` mensajes`, allowedMentions: { repliedUser: false } });
            } else if(messagesToClear <= 0) {
                return message.reply({ content: `${emojis.negativo} | La cantidad a limpiar no puede ser menor a \`1\``, allowedMentions: { repliedUser: false } });
            }
            if(isNaN(messagesToClear)) {
                return message.channel.send({ content: `${emojis.negativo} | La cantidad debe ser un número!` });
            }
            if(messagesToClear > 100) {
                return message.reply({ content: `${emojis.negativo} | La cantidad a limpiar debe ser menor a \`100\``, allowedMentions: { repliedUser: false } });
            }
            message.channel.bulkDelete(messagesToClear, true).then(() => {
                message.channel.send({ content: `${emojis.positivo} | \`${messagesToClear}\` mensajes limpiados correctamente` });
            }).catch(e => {});
        } else if(message.member.permissions.has("MANAGE_MESSAGES")) {
            if(!message.guild.me.permissions.has("MANAGE_MESSAGES")) {
                return message.reply({ content: `No puedo interactuar con este servidor sin los siguientes permisos: \`MANAGE_MESSAGES\``, allowedMentions: { repliedUser: false } });
            }
            const messagesToClear = args[0];
            if(!messagesToClear) {
                return message.reply({ content: `${emojis.negativo} | No puedo limpiar \`0\` mensajes`, allowedMentions: { repliedUser: false } });
            } else if(messagesToClear <= 0) {
                return message.reply({ content: `${emojis.negativo} | La cantidad a limpiar no puede ser menor a \`1\``, allowedMentions: { repliedUser: false } });
            }
            if(isNaN(messagesToClear)) {
                return message.channel.send({ content: `${emojis.negativo} | La cantidad debe ser un número!` });
            }
            if(messagesToClear > 100) {
                return message.reply({ content: `${emojis.negativo} | La cantidad a limpiar debe ser menor a \`100\``, allowedMentions: { repliedUser: false } });
            }
            message.channel.bulkDelete(messagesToClear, true).then(() => {
                message.channel.send({ content: `${emojis.positivo} | \`${messagesToClear}\` mensajes limpiados correctamente` });
            }).catch(e => {});
        } else {
            return message.reply({ content: `${emojis.negativo} | \`No tienes permisos para ejecutar esta acción\` `, allowedMentions: { repliedUser: false } });
        }
    }
}