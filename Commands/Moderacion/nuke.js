const { MessageEmbed, MessageActionRow, Message, MessageButton } = require("discord.js");
const emojis = require("../../emojis");
const Perms = require("../../Models/ModPerms");

module.exports = {
    name: "nuke",
    aliases: ["nukear"],
    description: "Elimina y clona un canal",
    permissions: "MANAGE_CHANNELS",
    cooldown: 5,
    /**
     * @param {Message} message
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
            if(!message.guild.me.permissions.has("ADMINISTRATOR")) {
                return message.reply({ content: `No puedo interactuar con este servidor sin los siguientes permisos: \`ADMINISTRADOR\``, allowedMentions: { repliedUser: false } });
            }
            const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                .setStyle("SUCCESS")
                .setEmoji(`${emojis.positivo}`)
                .setCustomId("nukear"),

                new MessageButton()
                .setStyle("DANGER")
                .setEmoji(`${emojis.negativo}`)
                .setCustomId("cancelar")
            )
            const Embed = new MessageEmbed()
            .setTitle("Información")
            .setDescription(`${emojis.cargando} | \`¿Estas seguro de hacer nuke a este canal?\``)
            .setColor("BLUE")
            const filter = i => i.user.id === message.author.id;
            const confirmacion = await message.reply({ embeds: [Embed], components: [row], allowedMentions: { repliedUser: false } });
            const colector = confirmacion.createMessageComponentCollector({ filter: filter, time: 20000 });
            colector.on('collect', async i => {
                if(i.customId === "nukear") {
                    if(!message.channel.deletable) {
                        const Embed = new MessageEmbed()
                        .setTitle("Información")
                        .setDescription(`${emojis.negativo} | \`No puedo nukear este canal\``)
                        .setColor("BLUE")
                        await i.deferUpdate();
                        await i.editReply({ embeds: [Embed], components: [], allowedMentions: { repliedUser: false } });
                    } else {
                        const Embed = new MessageEmbed()
                        .setTitle("Información")
                        .setDescription(`${emojis.positivo} | \`Entendido, nukeando canal\``)
                        .setColor("BLUE")
                        await i.deferUpdate();
                        await i.editReply({ embeds: [Embed], components: [], allowedMentions: { repliedUser: false } });
                        message.channel.clone().then(c => {
                            c.setPosition(message.channel.position)
                            if(message.channel.topic) {
                                c.setTopic(message.channel.topic)
                            }
                            if(message.channel.rateLimitPerUser) {
                                c.setRateLimitPerUser(message.channel.rateLimitPerUser)
                            }
                            message.channel.delete();
                            const NukeEmbed = new MessageEmbed()
                            .setTitle("Información")
                            .setDescription(`${emojis.positivo} | \`He nukeado este canal con exito\``)
                            .setColor("BLUE")
                            c.send({ embeds: [NukeEmbed] });
                        });
                    }
                } else if(i.customId === "cancelar") {
                    const Embed = new MessageEmbed()
                        .setTitle("Información")
                        .setDescription(`${emojis.negativo} | \`Entendido, he cancelado el nuke\``)
                        .setColor("BLUE")
                        await i.deferUpdate();
                        await i.editReply({ embeds: [Embed], components: [], allowedMentions: { repliedUser: false } });
                }
            });
        } else if(message.member.permissions.has("MANAGE_CHANNELS")) {
            if(!message.guild.me.permissions.has("ADMINISTRATOR")) {
                return message.reply({ content: `No puedo interactuar con este servidor sin los siguientes permisos: \`ADMINISTRADOR\``, allowedMentions: { repliedUser: false } });
            }
            const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                .setStyle("SUCCESS")
                .setEmoji(`${emojis.positivo}`)
                .setCustomId("nukear"),

                new MessageButton()
                .setStyle("DANGER")
                .setEmoji(`${emojis.negativo}`)
                .setCustomId("cancelar")
            )
            const Embed = new MessageEmbed()
            .setTitle("Información")
            .setDescription(`${emojis.cargando} | \`¿Estas seguro de hacer nuke a este canal?\``)
            .setColor("BLUE")
            const filter = i => i.user.id === message.author.id;
            const confirmacion = await message.reply({ embeds: [Embed], components: [row], allowedMentions: { repliedUser: false } });
            const colector = confirmacion.createMessageComponentCollector({ filter: filter, time: 20000 });
            colector.on('collect', async i => {
                if(i.customId === "nukear") {
                    if(!message.channel.deletable) {
                        const Embed = new MessageEmbed()
                        .setTitle("Información")
                        .setDescription(`${emojis.negativo} | \`No puedo nukear este canal\``)
                        .setColor("BLUE")
                        await i.deferUpdate();
                        await i.editReply({ embeds: [Embed], components: [], allowedMentions: { repliedUser: false } });
                    } else {
                        const Embed = new MessageEmbed()
                        .setTitle("Información")
                        .setDescription(`${emojis.positivo} | \`Entendido, nukeando canal\``)
                        .setColor("BLUE")
                        await i.deferUpdate();
                        await i.editReply({ embeds: [Embed], components: [], allowedMentions: { repliedUser: false } });
                        message.channel.clone().then(c => {
                            c.setPosition(message.channel.position)
                            if(message.channel.topic) {
                                c.setTopic(message.channel.topic)
                            }
                            if(message.channel.rateLimitPerUser) {
                                c.setRateLimitPerUser(message.channel.rateLimitPerUser)
                            }
                            message.channel.delete();
                            const NukeEmbed = new MessageEmbed()
                            .setTitle("Información")
                            .setDescription(`${emojis.positivo} | \`He nukeado este canal con exito\``)
                            .setColor("BLUE")
                            c.send({ embeds: [NukeEmbed] });
                        });
                    }
                } else if(i.customId === "cancelar") {
                    const Embed = new MessageEmbed()
                        .setTitle("Información")
                        .setDescription(`${emojis.negativo} | \`Entendido, he cancelado el nuke\``)
                        .setColor("BLUE")
                        await i.deferUpdate();
                        await i.editReply({ embeds: [Embed], components: [], allowedMentions: { repliedUser: false } });
                }
            });
        } else {
            return message.reply({ content: `${emojis.negativo} | \`No tienes permisos para ejecutar esta acción\` `, allowedMentions: { repliedUser: false } });
        }
    }
}