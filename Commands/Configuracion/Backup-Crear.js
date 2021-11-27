const { MessageEmbed, MessageActionRow, Message, MessageButton, Client } = require("discord.js");
const emojis = require("../../emojis");
const GBC = require("../../Models/GuildBackupCreate");
const Premium = require("../../Models/UserPremium");
const backup = require("discord-backup");
let oncooldown = false;

module.exports = {
    name: "backup-crear",
    aliases: ["servidor-crear"],
    description: "Crea una backup de tu servidor",
    permissions: "Owner",
    cooldown: 2,
    /**
     * @param {Message} message
     * @param {Client} Client
     */
    async execute(message, args, commandName, client, Discord, prefix) {
        if(message.guild.ownerId !== message.author.id) {
            return message.reply({ content: `Solo el __propietario__ de este servidor puede usar esto`, allowedMentions: { repliedUser: false } });
        }
        const UserIsPremium = await Premium.findOne({ userId: message.author.id });
        if(!UserIsPremium) {
            return message.channel.send({ content: "Este comando es de uso `premium`!, unete a nuestro servidor de soporte para más información. https://discord.gg/tPWYAPhhwz" });
        }
        const backups = await GBC.find({ authorId: message.author.id });
        if(backups?.length >= 5) {
            return message.reply({ content: `Ya cuentas con \`5\` backups en tu cuenta, ya no es posible crear más.` });
        }
        message.channel.send({ content: ""+emojis.cargando+" | Creando backup, esto puede tardar un momento..." })
        const bck = await backup.create(message.guild, {
            maxMessagesPerChannel: 5
        }).catch(e => {});
        const cgb = new GBC({
            guildName: message.guild.name,
            guildId: message.guild.id,
            backupId: bck.id,
            authorId: message.author.id
        });
        await cgb.save();
        const Embed = new MessageEmbed()
        .setDescription(`¡Backup creada con exito!`)
        .addFields(
            [
                {
                    name: "📂 | Backup Info",
                    value: `\`\`\`${prefix}backup-info ${bck.id}\`\`\``
                },
                {
                    name: "📤 | Cargar Backup",
                    value: `\`\`\`${prefix}backup-cargar ${bck.id}\`\`\``
                }
            ]
        )
        .setColor("BLUE")
        .setTimestamp()
        .setFooter(message.guild.name)
        message.channel.send({ embeds: [Embed] });
    }
}