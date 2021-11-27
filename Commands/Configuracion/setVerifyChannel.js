const { Message, Client, MessageEmbed } = require("discord.js")
const Verify = require("../../Models/Verify");
const VerifyRole = require("../../Models/VerifyRole");

module.exports = {
    name: "set-verify-channel",
    aliases: ["setverifychannel"],
    description: "Donde se enviaran los mensajes de verificación / captcha",
    permissions: "ADMINISTRATOR",
    usage: "set-verify-channel #Canal",
    /**
     * 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {Client} client 
     */
    async execute(message, args, commandName, client, Discord, prefix) {
        if(!message.member.permissions.has("ADMINISTARTOR")) {
            return message.channel.send({ content: "Necesitas __administrador__ para ejecutar esto." });
        }
        if(!message.guild.me.permissions.has("ADMINISTRATOR")) {
            return message.channel.send({ content: "Necesito __administrador__ para ejecutar esto." });
        }
        const nVRE = await VerifyRole.findOne({ guildId: message.guild.id });
        if(!nVRE) {
            return message.channel.send({ content: `No haz colocado un rol para la verificación, colocalo con \`${prefix}set-verify-role\`` });
        }
        const Channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
        if(!Channel) {
            return message.channel.send({ content: "Por favor __menciona o proporciona__ la id de un canal para guardar." })
        }
        const nVCE = await Verify.findOne({ guildId: message.guild.id });
        if(nVCE) {
            nVCE.channelId = Channel.id;
            await nVCE.save();
            message.channel.send({ content: `Entendido, enviare los mensajes de verificacion a <#${Channel.id}>.` });
        } else { 
            const nVCE = new Verify({
                guildId: message.guild.id,
                channelId: Channel.id
            });
            await nVCE.save();
            message.channel.send({ content: `Entendido, enviare los mensajes de verificacion a <#${Channel.id}>.` });
        }
    }
}