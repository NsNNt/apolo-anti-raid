const { Message, Client, MessageEmbed } = require("discord.js")
const Verify = require("../../Models/Verify");
const VerifyRole = require("../../Models/VerifyRole");

module.exports = {
    name: "set-verify-role",
    aliases: ["setverifyrole"],
    description: "El rol que otorgare al solucionar el captcha",
    permissions: "ADMINISTRATOR",
    usage: "set-verify-role @Rol",
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
        const Role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);
        if(!Role) {
            return message.channel.send({ content: "Por favor __menciona o proporciona__ la id de un rol para guardar." })
        }
        const nVRE = await VerifyRole.findOne({ guildId: message.guild.id });
        if(nVRE) {
            nVRE.roleId = Role.id;
            await nVRE.save();
            message.channel.send({ content: `Entendido, usare el rol ${Role} para verificar usuarios`, allowedMentions: { roles: false } });
        } else {
            const nVR = new VerifyRole({
                guildId: message.guild.id,
                roleId: Role.id
            });
            await nVR.save();
            message.channel.send({ content: `Entendido, usare el rol ${Role} para verificar usuarios`, allowedMentions: { roles: false } });
        }
    }
}