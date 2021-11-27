const { MessageEmbed, MessageActionRow, Message, MessageButton, Client } = require("discord.js");
const emojis = require("../../emojis");
const GBC = require("../../Models/GuildBackupCreate");
const Premium = require("../../Models/UserPremium");
const backup = require("discord-backup");
let oncooldown = false;

module.exports = {
    name: "backup-delete",
    aliases: ["servidor-delete"],
    description: "Elimina una backup tuya",
    usage: "backup-delete <BackupId>",
    cooldown: 2,
    /**
     * @param {Message} message
     * @param {Client} Client
     */
    async execute(message, args, commandName, client, Discord, prefix) {
        const UserIsPremium = await Premium.findOne({ userId: message.author.id });
        if(!UserIsPremium) {
            return message.channel.send({ content: "Este comando es de uso `premium`!, unete a nuestro servidor de soporte para más información. https://discord.gg/tPWYAPhhwz" });
        }
        const backupId = args[0];
        if(!backupId) {
            return message.channel.send({ content: "¡Tienes que proporcionar una id!" });
        } else {
            const backupSearch = await GBC.findOne({ backupId: backupId });
            if(!backupSearch) {
                return message.channel.send({ content: "¡Tienes que proporcionar una id valida!" });
            } else { 
                if(backupSearch?.authorId !== message.author.id) {
                    message.channel.send({ content: "¡Esa backup no te pertenece!" });
                } else {
                    await backup.remove(backupId).then(async () => {
                        message.channel.send({ content: "¡Se elimino correctamente la backup!" });
                        await GBC.findOneAndDelete({ backupId: backupId }).catch(e => {});
                    }).catch(e => { return message.channel.send({ content: "Un error inesperado ocurrio en el proceso, contacta con el servidor de soporte: https://discord.gg/ZQCcer2XsF" }) });
                }
            }
        }

    }
}