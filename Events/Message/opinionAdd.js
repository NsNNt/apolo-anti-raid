const { Client, Message, MessageEmbed, Collection, MessageActionRow, MessageButton } = require("discord.js");
const Passwords = require("../../password");
const PremiumCode = require("../../Models/Premium");
const emojis = require("../../emojis");

module.exports = {
    name: "messageCreate",
    /**
     * 
     * @param {Message} message 
     * @param {Client} client 
     */
    async execute(message, client) {
        if(!message.guild) return;
        if(message.guild.id !== "866670008201773067") {
            return;
        } else {
            if(message.channel.id === "901633582500569098") {
                if(message.author.bot) return;
                message.channel.send({ content: "¡Gracias por tu opinión!" }).then(msg => {
                    setTimeout(async () => {
                        msg.delete().catch(e => {});
                    }, 5000);
                });
                await message.react(`${emojis.positivo}`)
                await message.react(`${emojis.negativo}`)
                
                const codigo = `1Month={${Passwords(6)}.-${Passwords(5)}:${Passwords(3)}}`
                const x_444 = new PremiumCode({
                    code: codigo,
                    time: 2592000000,
                    timestamp: Date.now(),
                    redemmed: false
                });
                await x_444.save();
                message.channel.permissionOverwrites.edit(message.member.id, {
                    SEND_MESSAGES: false,
                    ADD_REACTIONS: false
                });
                message.author.send({ content: `**¡Agradezco tu opinión!, valoro tanto tu opinión que decidi regalarte premium.**\n\n\`ap!premium ${x_444.code}\`` }).catch(e => {});
            }
        }
    }
}