const { MessageEmbed, MessageActionRow, Message, MessageButton, Client } = require("discord.js");
const Staff = require("../../Models/Staff");
const emojis = require("../../emojis");

module.exports = {
    name: "removestaff",
    aliases: ["ap-r-staff"],
    description: "Comando privado",
    permissions: "Privado",
    /**
     * @param {Message} message
     * @param {Client} client
     */
    async execute(message, args, commandName, client, Discord) {
        if(message.author.id !== "852969002678222868") {
            return;
        }
        const user = message.mentions.members.first() || client.users.cache.get(args[0]);
        if(!user) {
            return message.channel.send({ content: "Ese usuario no existe" });
        } else {
            const staff = await Staff.findOne({ userId: user.id });
            if(!staff) {
                return message.channel.send({ content: "Ese usuario no es staff" })
            } else {
                const dStaff = await Staff.findOneAndDelete({ userId: user.id });
                message.channel.send({ content: `${user} fue removido de mi lista de staffs.` });
            }
        }
    }
}