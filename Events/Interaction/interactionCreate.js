const { Client, Message, MessageEmbed, MessageActionRow, MessageButton, Collection, Interaction, MessageAttachment } = require("discord.js");
const Prefix = "ap!"
const Ticket = require("../../Models/Ticket");
const TicketsCount = require("../../Models/Tickets");
const fs = require("fs");
const emojis = require("../../emojis");

module.exports = {
    name: "interactionCreate",
    /**
     * @param {Client} client
     * @param {Interaction} interaction
     */
    async execute(interaction, client) {
        if(!interaction.isButton()) return;

        if(interaction.customId === "ticket") {
            await interaction.reply({ content: "Creando ticket, espera un momento...", ephemeral: true });
            const tickets = await TicketsCount.find();
            let ticket = await Ticket.findOne({ userId: interaction.user.id });
            if(ticket) {
                return interaction.editReply({ content: `Usted ya cuenta con un ticket creado, <#${ticket.channelId}>`, ephemeral: true })
            } else {
                const nct = new Ticket({
                    userId: interaction.user.id,
                    ticketId: parseInt(tickets.length + 1),
                    messages: []
                });
                await nct.save();
                const ntsc = new TicketsCount({
                    tickets: parseInt(tickets.length + 1)
                });
                await ntsc.save();
                interaction.guild.channels.create(`ticket-${nct.ticketId}`, {
                    permissionOverwrites: [
                        {
                            id: interaction.guild.roles.everyone,
                            deny: ["VIEW_CHANNEL"]
                        },
                        {
                            id: interaction.guild.roles.cache.get("901574758242607184"),
                            allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY", "ATTACH_FILES", "MANAGE_MESSAGES"]
                        },
                        {
                            id: interaction.guild.roles.cache.get("900777133377474610"),
                            allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY", "ATTACH_FILES", "MANAGE_MESSAGES"]
                        }, 
                        {
                            id: interaction.guild.roles.cache.get("900777135940198430"),
                            allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY", "ATTACH_FILES", "MANAGE_MESSAGES"]
                        },
                        {
                            id: interaction.guild.roles.cache.get("905165308568948746"),
                            allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY", "ATTACH_FILES", "MANAGE_MESSAGES"]
                        },
                        {
                            id: interaction.user.id,
                            allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY", "ATTACH_FILES"]
                        },
                    ], parent: "901582049356419133"
                }).then(async (channel) => {
                    nct.channelId = channel.id;
                    await nct.save();
                    await interaction.editReply({ content: `Su ticket se abrio con exito, <#${channel.id}>` });
                    const chl = await interaction.guild.channels.cache.get("904117210245644379")
                    chl.send({ content: `\`${interaction.user.tag}\` | Abrio un ticket` });
                    const row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                        .setCustomId("cerrar")
                        .setLabel("Cerrar Ticket")
                        .setStyle("DANGER")
                    )
                    const EmbedTicket = new MessageEmbed()
                    .setAuthor(interaction.guild.name, interaction.guild.iconURL({ dynamic: true }))
                    .setDescription("> `Para cerrar el ticket simplemente toca el boton de abajo`")
                    .setColor("RED")
                    .setTimestamp()
                    .setFooter("Ticket abierto")
                    await channel.send({ content: `<@!${interaction.member.user.id}> Abrio un ticket en busca de soporte, seras atendido pronto por un staff, este ticket es tuyo, nadie más lo puede cerrar, porfavor si no tienes más dudas de las que ya han sido respondidas puedes cerrar este ticket.`, allowedMentions: { repliedUser: false } });
                    await channel.send({ content: `<@!${interaction.member.user.id}> <@&901574758242607184> <@&900777135940198430> <@&905165308568948746>`, embeds: [EmbedTicket], components: [row] }).then(msg => msg.pin());
                });
            }
        }
        if(interaction.customId === "cerrar") {
            const findTicket = await Ticket.findOne({ userId: interaction.user.id });
            if(!findTicket) {
                return interaction.reply({ content: "No tienes ningun ticket creado...", ephemeral: true });
            } else {
                await interaction.reply({ content: "Ticket eliminado correctamente", ephemeral: true });
                const ch = interaction.guild.channels.cache.get(findTicket.channelId)
                setTimeout(async () => {
                    ch.permissionOverwrites.edit(interaction.user.id, {
                        VIEW_CHANNEL: false,
                        SEND_MESSAGES: false
                    });
                    ch.send({ content: `${emojis.cargando} | Guardando los mensajes de este canal.` });
                    const messages = await ch.messages.fetch({ limit: 100 });
                    const file = await fs.writeFileSync(`${ch.name}.txt`, `${messages
                        .sort((a, b) => { return a.createdTimestamp - b.createdTimestamp })
                        .map((msg, i) => `${msg.author.tag} | ${msg.author.id} => ${msg.content}`).join("\n")}`);
                    const fileToSend = new MessageAttachment(
                        `./${ch.name}.txt`,
                        `${ch.name}.txt`
                    );
                    ch.send({ content: `Los mensajes de este canal fueron guardados correctamente!`, files: [fileToSend] });
                    const chl = await interaction.guild.channels.cache.get("904117210245644379")
                    chl.send({ content: `\`${interaction.user.tag}\` | Cerro un ticket, contenido:`, files: [fileToSend] });
                    await Ticket.findOneAndDelete({ userId: interaction.user.id });
                    const EmbedTicket = new MessageEmbed()
                    .setAuthor(interaction.guild.name, interaction.guild.iconURL({ dynamic: true }))
                    .setDescription("```markdown\n# Este ticket sera eliminado en 10s\n```")
                    .setColor("RED")
                    .setTimestamp()
                    .setFooter("Ticket abierto a las:")
                    ch.send({ embeds: [EmbedTicket] });
                    setTimeout(async () => {
                        ch.delete().catch(e => {});
                    }, 10000)
                }, 1000);
            }
        }
    }
}