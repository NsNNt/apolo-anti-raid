const { MessageEmbed, MessageActionRow, Message, MessageButton } = require("discord.js");
const emojis = require("../../emojis");
const moment = require("moment"); 
const Premium = require("../../Models/UserPremium");

module.exports = {
    name: "purgeme",
    aliases: ["purgeame"],
    description: "Limpia tus mensajes en el canal que lo utilices",
    usage: "purgeme <Cantidad>",
    cooldown: 5,
    /**
     * @param {Message} message
     */
    async execute(message, args, commandName, client, Discord) {
        const up = Premium.findOne({ userId: message.author.id });
        if(!up) {
            return message.channel.send({ content: "Este comando es de uso __`premium`__!, unete a nuestro servidor de soporte para más información. https://discord.gg/tPWYAPhhwz" });
        }
        if(!message.member.permissions.has("MANAGE_MESSAGES")) {
            return message.channel.send({ content: `No tienes __permisos de manejar mensajes__ para ejecutar esto.` });
        }
        if(!message.guild.me.permissions.has("MANAGE_MESSAGES")) {
            return message.channel.send({ content: `No puedo interactuar con este servidor sin los siguientes permisos: \`MANAGE_MESSAGES\``, allowedMentions: { repliedUser: false } });
        }
        const cantidad = args[0];
        if(!cantidad) {
            return message.channel.send({ content: "Por favor proporciona un numero de mensajes para eliminar." });
        }
        if(isNaN(cantidad)) {
            return message.channel.send({ content: "Por favor proporciona un numero de mensajes para eliminar." });
        }
        if(cantidad <= 0) {
            return message.channel.send({ content: "No puedo limpiar menos de `1` mensaje." });
        }
        if(cantidad > 100) {
            return message.channel.send({ content: "No puedo limpiar mas de `100` mensajes." });
        }
        const messages = await message.channel.messages.fetch({
            limit: cantidad
        });
        const userMessages = messages.filter(m => m.author.id === message.author.id);
        message.channel.bulkDelete(userMessages, true);
        message.channel.send({ content: "Limpie `"+userMessages.size+"` mensajes de `"+message.author.tag+"` con exito!" })
    }
}