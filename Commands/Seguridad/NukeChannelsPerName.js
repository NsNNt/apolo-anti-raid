const { MessageEmbed, MessageActionRow, Message, MessageButton } = require("discord.js");
const emojis = require("../../emojis");

module.exports = {
    name: "nukechannels-pername",
    aliases: ["nuke-channels-pername", "nukechannels-byname"],
    description: "Elimina todos los canales por el nombre que existan",
    usage: "nukechannels-pername <Nombre>",
    cooldown: 5,
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
                return message.reply({ content: `El uso correcto es \`nukechannels-pername <Nombre de los canales>\``, allowedMentions: { repliedUser: false } });
            } else {
                const Embed = new MessageEmbed()
                .setTitle("Información")
                .setDescription(`${emojis.cargando} | \`Eliminando canales\``)
                .setColor("BLUE")
                const msg = await message.reply({ embeds: [Embed], allowedMentions: { repliedUser: false } });
                message.guild.channels.cache.forEach(async c => {
                    if(c.name === name) {
                        await setTimeout(() => {
                            c.delete().catch(e => {});
                        }, 1200);
                    }
                });
                const Response = new MessageEmbed()
                .setTitle("Información")
                .setDescription(`${emojis.positivo} | \`Canales eliminados correctamente\``)
                .setColor("GREEN")
                msg.edit({ embeds: [Response] });
            }
        }
    }
}