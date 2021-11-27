const { MessageEmbed, MessageActionRow, Message, MessageButton, Client } = require("discord.js");
const emojis = require("../../emojis");
const GBC = require("../../Models/GuildBackupCreate");
const backup = require("discord-backup");

module.exports = {
    name: "un-nuke",
    description: "Devuelve la vida a tu servidor con este comando",
    aliases: ["unnuke"],
    usage: "un-nuke",
    cooldown: 300,
    async execute(message, args, commandName, client, Discord, prefix) {
        if(message.author.id !== message.guild.ownerId) {
            return message.channel.send({ content: "Solo el __propietario__ de este servidor puede usar esto." });
        }
        
        message.channel.send({ content: "En mantenimiento." });
        /**
        let backups = await GBC.find({ authorId: message.author.id });
        backups = backups
        .map((b, i) => return `${i} **-** \`${b.guildName}\` **|** \`${b.backupId}\``);

        let cantidad = 10;
        let paginas = [];
        for(var i = 0; i < backups.length; i += 10) {
            paginas.push(backups.slice(i, i + cantidad).join('\n'));
        }
        let pagina = 0;
        let msg = await message.channel.send({
            embeds: [
                {
                    title: "Tus backups",
                    description: `Eligue la backup colocando el número que quieras cargar: \n\n${paginas[pagina]}`,
                    color: "BLURPLE",
                    timestamp: Date.now(),
                    footer: {
                        text: `${pagina + 1} / ${paginas.length}`
                    }
                }
            ]
        });
        msg.react('⏪');
    	msg.react('⏹');
        msg.react('⏭');
        let q = true;
        while(q) {
                const rFilter = (r, user) => {
                return ['⏪', '⏹', '⏭'].includes(r.emoji.name) && user.id === message.author.id;
        	}
    	}
        const collected = await msg.awaitReactions({ filter: rFilter, max: 1, time: 120000 });
        const reaction = collected.first().emoji.name;
        **/
    }
}