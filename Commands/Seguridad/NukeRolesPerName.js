const { MessageEmbed, MessageActionRow, Message, MessageButton } = require("discord.js");
const emojis = require("../../emojis");

module.exports = {
    name: "nukeroles-pername",
    aliases: ["nuke-roles-pername", "nukeroles-byname"],
    description: "Elimina todos los roles por el nombre que existan",
    usage: "nukeroles-pername <Nombre>",
    cooldown: 3,
    permissions: "ADMINISTRATOR",
    /**
     * @param {Message} message
     */
    async execute(message, args, commandName, client, Discord) {
        if(!message.member?.permissions.has("ADMINISTRATOR")) {
            return message.reply({ content: `${emojis.negativo} | \`No tienes permisos para ejecutar este comando\``, allowedMentions: { repliedUser: false } });
        } else {
            if(!message.guild.me.permissions.has("ADMINISTRATOR")) {
                return message.reply({ content: `No puedo interactuar con este servidor sin los siguientes permisos: \`ADMINISTRADOR\``, allowedMentions: { repliedUser: false } });
            }
            const name = args.join(" ");
            if(!name) {
                return message.reply({ content: `El uso correcto es \`nukeroles-pername <Nombre de los roles>\``, allowedMentions: { repliedUser: false } });
            } else {
                const Embed = new MessageEmbed()
                .setTitle("Información")
                .setDescription(`${emojis.cargando} | \`Eliminando roles\``)
                .setColor("BLUE")
                const msg = await message.reply({ embeds: [Embed], allowedMentions: { repliedUser: false } });
                message.guild.roles.cache.forEach(role => {
                    if(role.name === name) {
                        role.delete().catch(e => {});
                    }
                });
                const Response = new MessageEmbed()
                .setTitle("Información")
                .setDescription(`${emojis.positivo} | \`Roles eliminados correctamente\``)
                .setColor("GREEN")
                msg.edit({ embeds: [Response] });
            }
        }
    }
}