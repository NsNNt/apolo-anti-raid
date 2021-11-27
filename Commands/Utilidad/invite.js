const { MessageEmbed, MessageActionRow, Message, MessageButton } = require("discord.js");
const emojis = require("../../emojis");

module.exports = {
    name: "invite",
    aliases: ["invitacion"],
    description: "Invitame a tu servidor",
    cooldown: 5,
    /**
     * @param {Message} message
     */
    async execute(message, args, commandName, client, Discord) {
        const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setStyle("LINK")
            .setEmoji("✉")
            .setLabel("Invitame")
            .setURL("https://discord.com/api/oauth2/authorize?client_id=901344194579279882&permissions=8&scope=bot")
        )
        message.reply({ "content": null,
  "embeds": [
    {
      "title": "__¿Me vas a añadir a tu servidor?__",
      "description": "`[*]` Ten en cuenta los siguientes consejos:\n\n`✅` Mantén mi permiso de __administrador__ activado.\n`✅` Mantén mi permiso de __banear y expulsar miembros__ activado.\n`✅` Mantén mi rol en lo mas alto del servidor.\n`❌` Bailarte una salsa y cumbia.\n\n__Invitación:__ https://discord.com/api/oauth2/authorize?client_id=901344194579279882&permissions=8&scope=bot\n__Externa:__ `⏬` Click aquí.",
      "color": 4331519
    }
  ], components: [row], allowedMentions: { repliedUser: false } });
    }
}