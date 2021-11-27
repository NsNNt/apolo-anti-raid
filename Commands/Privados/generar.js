const { MessageEmbed, MessageActionRow, Message, MessageButton } = require("discord.js");
const Passwords = require("../../password");
const emojis = require("../../emojis");
const PremiumCode = require("../../Models/Premium");
const ms = require("ms");
const moment = require("moment")

module.exports = {
    name: "generar",
    aliases: ["generate"],
    description: "Comando privado",
    permissions: "Privado",
    /**
     * @param {Message} message
     */
    async execute(message, args, commandName, client, Discord) {
        let Cantidad = args[0];
        let TiempoC = args[1];
        let Tiempo;
        let Codigos = [];
        if(message.author.id !== "852969002678222868") {
            return message.reply({ content: `${emojis.negativo} | \`Ese comando no existe\``, allowedMentions: { repliedUser: false } });
        } else {
            if(!Cantidad) {
                return message.reply({ content: `No mencionaste la cantidad a generar!`, allowedMentions:{ repliedUser: false } });
            }
            if(!TiempoC) {
                Tiempo = 0;
                TiempoC = "Infinito";
            } 
            if(TiempoC.endsWith("m")) {
                Tiempo = 2592000000;
                TiempoC = "1Month";
            }
            if(TiempoC.endsWith("y")) {
                Tiempo = 31557600000;
                TiempoC = "1Year"
            }
            let msgr = await message.channel.send({ content: "Generando codigos..." });
            for(let i = 0; i < Cantidad; i++) {
                const codigo = `${TiempoC}={${Passwords(6)}.-${Passwords(5)}:${Passwords(3)}}`
                Codigos.push(codigo)
                const x_444 = new PremiumCode({
                    code: codigo,
                    time: Tiempo,
                    timestamp: Date.now(),
                    redemmed: false
                });
                await x_444.save();
            }
            const asd = Codigos.map(c => `\n${c}`).join(" ")
            msgr.edit({ content: `\`\`\`${asd}\`\`\`` });
        }
    }
}