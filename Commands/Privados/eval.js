const { MessageEmbed, MessageActionRow, Message, MessageButton } = require("discord.js");
const { inspect } = require("util");
const emojis = require("../../emojis");

module.exports = {
    name: "eval",
    aliases: ["evaluar"],
    description: "Comando privado",
    permissions: "Privado",
    /**
     * @param {Message} message
     */
    async execute(message, args, commandName, client, Discord) {
        if(message.author.id !== "852969002678222868") {
            return;
        }
        const comando = args.join(" ");
        if(!comando) {
            return message.reply({ content: `${emojis.negativo} | No proporcionaste ningun comando`, allowedMentions: { repliedUser: false } });
        } else {
            try {
                const evaluado = eval(comando)
                const badwords = ["token", "destroy", "login"];
                if(badwords.some(w => message.content.toLowerCase().includes(w))) {
                    return message.reply({ content: `${message.author}, No puedo permitir esa evaluación`, allowedMentions: { repliedUser: false } });
                } else {
                    const embed = new Discord.MessageEmbed()
                    .setColor('BLUE')
                    .setTitle('Evaluacion Completada')
                    .setAuthor('Apolo', client.user.avatarURL())
                    .setDescription(`> El comando ha sido evaluado correctamente.`)
                    .addField(`> Tipo: `, `\`\`\`${typeof(evaluado)}\`\`\``, true)
                    .addField(`> Evaluado en: `, `\`\`\`yaml\n${Date.now() - message.createdTimestamp}ms\n\`\`\``, true)
                    .addField(`> Entrada: `, `\`\`\`js\n${comando}\n\`\`\``)
                    .addField(`> Salida: `, `\`\`\`js\n${inspect(evaluado, { depth: 0 })}\n\`\`\``)
                    .setTimestamp()
                    message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } })  
                }
            } catch (e) {
                const embed2 = new Discord.MessageEmbed()
                .setColor('RED')
                .setTitle('Error al intentar evaluar')
                .setAuthor('Apolo', client.user.avatarURL())
                .setDescription(`> El comando no se pudo evaluar correctamente.`)
                .addField(`> Evaluado en: `, `\`\`\`yaml\n${Date.now() - message.createdTimestamp}ms\n\`\`\``, true)
                .addField(`> Entrada: `, `\`\`\`js\n${comando}\n\`\`\``)
                .addField(`> Salida: `, `\`\`\`js\n${e}\n\`\`\``)
                .setTimestamp()
                message.reply({ embeds: [embed2], allowedMentions: { repliedUser: false } });
            }
        }
    }
}