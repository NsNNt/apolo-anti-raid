const { MessageEmbed, MessageActionRow, Message, MessageButton, Client } = require("discord.js");
const emojis = require("../../emojis");
const ModRole = require("../../Models/ModRole");
const Perms = require("../../Models/ModPerms");
const Warn = require("../../Models/Warn");

module.exports = {
    name: "warnlist",
    aliases: ["listwarn", "warns"],
    description: "Ve la lista de advertencias que tiene un usuario en tu servidor",
    usage: "warnlist @Usuario",
    permissions: "KICK_MEMBERS",
    cooldown: 5,
    /** 
     * @param {Message} message
     * @param {Client} client
    */
    async execute(message, args, commandName, client, Discord) {
        const userRoles = message.member.roles.cache;
        const findRolePerm = await Perms.find({ guildId: message.guild.id });
        let RolePerm;
        findRolePerm.some(d => {
            const role = userRoles.find(r => r.id === d.roleId);
            if(role) {
                RolePerm = role?.id
            }
        });
        const findPerms = await Perms.findOne({ guildId: message.guild.id, roleId: RolePerm });
        if(findPerms?.allowed.includes(commandName) && !findPerms?.denied.includes(commandName)) {
            if(!message.guild.me.permissions.has("KICK_MEMBERS")) {
                return message.reply({ content: `No puedo interactuar con este comando sin los siguientes permisos: \`KICK_MEMBERS\``, allowedMentions: { repliedUser: false } });
            }
            const User = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
            if(!User) {
                return message.reply({ content: `${emojis.negativo} | \`No se encuentra a ese usuario\` `, allowedMentions: { repliedUser: false } })
            }
            const Warns = await Warn.find({ guildId: message.guild.id, warnedId: User.user.id });
            console.log(Warns)
            if(!Warns) {
                return message.reply({ content: `${emojis.negativo} | \`Este usuario no tiene warns en este servidor\``, allowedMentions: { repliedUser: false } });
            } else {
                if(Warns.length <= 0) {
                    return message.reply({ content: `${emojis.negativo} | \`Este usuario no tiene warns en este servidor\``, allowedMentions: { repliedUser: false } });
                }
                const AwaitResponse = new MessageEmbed()
                .setTitle("Cargando")
                .setDescription(`${emojis.cargando} | \`Obteniendo datos desde el servidor\``)
                .setColor("BLUE")
                let msg = await message.reply({ embeds: [AwaitResponse], allowedMentions: { repliedUser: false } });
                const embedDescription = Warns.map(
                    (warn, i) => `\n**${i + 1}** - Razon: \`${warn.razon}\` - Creado: \`${warn.warnCreated}\` - ID: \`${warn.warnId}\` - Moderador: ${message.guild.members.cache.get(warn.modId)}`
                );
                const Response = new MessageEmbed()
                .setDescription(`Lista de warns de ${User}\n ${embedDescription.join(' ')}`)
                .setColor("BLUE")
                .setTimestamp()

                msg.edit({ embeds: [Response] })
            }
        } else if(message.member.permissions.has("KICK_MEMBERS")) {
            if(!message.guild.me.permissions.has("KICK_MEMBERS")) {
                return message.reply({ content: `No puedo interactuar con este comando sin los siguientes permisos: \`KICK_MEMBERS\``, allowedMentions: { repliedUser: false } });
            }
            const User = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
            if(!User) {
                return message.reply({ content: `${emojis.negativo} | \`No se encuentra a ese usuario\` `, allowedMentions: { repliedUser: false } })
            }
            const Warns = await Warn.find({ guildId: message.guild.id, warnedId: User.user.id });
            console.log(Warns)
            if(!Warns) {
                return message.reply({ content: `${emojis.negativo} | \`Este usuario no tiene warns en este servidor\``, allowedMentions: { repliedUser: false } });
            } else {
                if(Warns.length <= 0) {
                    return message.reply({ content: `${emojis.negativo} | \`Este usuario no tiene warns en este servidor\``, allowedMentions: { repliedUser: false } });
                }
                const AwaitResponse = new MessageEmbed()
                .setTitle("Cargando")
                .setDescription(`${emojis.cargando} | \`Obteniendo datos desde el servidor\``)
                .setColor("BLUE")
                let msg = await message.reply({ embeds: [AwaitResponse], allowedMentions: { repliedUser: false } });
                const embedDescription = Warns.map(
                    (warn, i) => `\n**${i + 1}** - Razon: \`${warn.razon}\` - Creado: \`${warn.warnCreated}\` - ID: \`${warn.warnId}\` - Moderador: ${message.guild.members.cache.get(warn.modId)}`
                );
                const Response = new MessageEmbed()
                .setDescription(`Lista de warns de ${User}\n ${embedDescription.join(' ')}`)
                .setColor("BLUE")
                .setTimestamp()

                msg.edit({ embeds: [Response] })
            }
        } else {
            return message.reply({ content: `${emojis.negativo} | \`No tienes permisos para ejecutar esta acción\` `, allowedMentions: { repliedUser: false } });
        }
    }
}