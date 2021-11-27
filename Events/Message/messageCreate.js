const { Client, Message, MessageEmbed, Collection, MessageActionRow, MessageButton } = require("discord.js");
const Prefix = require('../../Models/Prefix');
const Blacklist = require("../../Models/Blacklist");
const Apelacion = require("../../Models/Apelacion");
const emojis = require("../../emojis");
const moment = require("moment");
let prefix;

module.exports = {
    name: "messageCreate",
    /**
     * @param {Client} client
     * @param {Message} message
     */
    async execute(message, client, Discord) {
        if(!message.guild) return;
        let ExistsPrefix = await Prefix.findOne({ guildId: message.guild.id });
        const blacklist = await Blacklist.findOne({ userId: message.author.id });
        if(!ExistsPrefix) {
            prefix = "ap!"
        } else {
            prefix = ExistsPrefix.prefix;
        }
        if(message.author.bot) return;
        if(!message.content.startsWith(prefix)) {
            if(message.mentions.has(client.user)) {
                if(message.content.includes("@everyone") || message.content.includes("@here")) {
                    return
                }
                const row = new MessageActionRow()
                .addComponents(
                	new MessageButton()
                   	.setStyle('LINK')
                    .setEmoji('✉')
                    .setURL('https://discord.gg/tPWYAPhhwz')
                    .setLabel('Soporte'),
                    new MessageButton()
                    .setStyle('LINK')
                    .setEmoji('📜')
                    .setURL('https://discord.com/api/oauth2/authorize?client_id=901344194579279882&permissions=8&scope=bot')
                    .setLabel('Invitar'),
                    new MessageButton()
                    .setStyle('LINK')
                    .setEmoji('🤖')
                    .setURL('https://discordbotlist.com/bots/apolo/upvote')
                    .setLabel('Votar')
                )
                return message.reply({ "embeds": [
    {
      "title": "¿Alguien me ha mencionado?",
      "description": "**[👋🏻]** ¡Hola, soy __Apolo__! un bot de protección y configuración de servidores.\n**[📝]** Mi prefix en este servidor es: `"+prefix+"`\n\n**¿Cuáles son mis comandos?**\n- Puedes revisar **todos** mis comandos con `"+prefix+"comandos`.\n\n**¿Cuál es el servidor de soporte?**\n- Puedes hacer [click aquí](https://discord.gg/tPWYAPhhwz) o seleccionar el boton `✉ Soporte`.\n\n**¿Cómo me invitas?**\n- Puedes hacer [click aquí](https://discord.com/api/oauth2/authorize?client_id=901344194579279882&permissions=8&scope=bot) directamente o haciendo click en `📜 Invitar`.\n\n**¿Cómo obtengo más información?**\n- Puedes utilizar el comando `"+prefix+"help` para más información útil acerca de mi.",
      "color": 2070527
    }
  ], components: [row], allowedMentions: { repliedUser: false } });
            }
            return;
        }
        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const commandName = args.shift().toLowerCase();
        if(!commandName) {
            return;
        }
        const isApeled = await Apelacion.findOne({ userId: message.author.id });
        if(commandName === "apelar") {
            const apelacion = args.join(" ");
            if(!blacklist) {
                return message.channel.send({ content: "No estas en la blacklist." });
            }
            if(isApeled) {
                return message.channel.send({ content: "Tu ya has apelado una sanción, espera nuestra respuesta." });
            }
            if(!apelacion) {
                return message.channel.send({ content: "Escribe tu apelación, tiene que ser decente y larga para poder tomarla en cuenta." });
            }
            if(apelacion.length < 20) {
                return message.channel.send({ content: "Escribe tu apelación con más de 20 caracteres." });
            }
            const canal = await client.channels.cache.get("911039544084815873");
            canal.send({
                embeds: [
                    {
                        title: "Nueva apelación",
                        description: `${apelacion}`,
                        footer: {
                            text: `${message.author.id}, ${message.author.tag}`
                        },
                        color: "BLURPLE",
                        timestamp: Date.now()
                    }
                ]
            });
            const asd = new Apelacion({
                userId: message.author.id
            });
            await asd.save();
            return message.channel.send({ content: "Apelación enviada, espera unos dias o semanas para saber tu respuesta." })
        }
        if(blacklist) {
            return message.reply({ content: `${emojis.negativo} No puedo interactuar con usuarios en la lista negra`, allowedMentions: { repliedUser: false } }).then(msg => {
                setTimeout(() => {
                    msg.delete().catch(() => {});
                }, 3000);
            });
        }
        const command = client.commands.get(commandName) || 
        client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if(!command) return message.reply({ content: `${emojis.negativo} | \`Ese comando no existe\``, allowedMentions: { repliedUser: false } });
        const { cooldowns } = client;
        if(!cooldowns.has(command.name)) {
            cooldowns.set(command.name, new Collection());
        }
        const now = Date.now();
        const timestamps = cooldowns.get(command.name);
        const cooldownAmount = (command.cooldown || 1) * 1000;

        if(timestamps.has(message.author.id)) {
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
            if(now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return message.reply({ content: `Tengo que enfriar mis sistemas! Espera \`${timeLeft.toFixed(1)}s\` para ejecutar esto de nuevo!`, allowedMentions: { repliedUser: false } }).then((msg) => {
                    setTimeout(() => {
                        msg.delete().catch(err => {});
                        message.delete().catch(err => {});
                    }, 10000);
                });
            }
        }
        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
        try {
            command.execute(message, args, commandName, client, Discord, prefix);
        } catch (error) {
            const errorEmbed = new MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setColor("RED")
            .setDescription("Un error ha ocurrido cuando se ejecutaba el comando, porfavor contacte con mis creadores para mas informacion")
            .setTimestamp()
            .setFooter("Apolo ❗")
            message.reply({ embeds: errorEmbed, allowedMentions: { repliedUser: false } }).then((msg) => {
                setTimeout(() => {
                    msg.delete().catch(err => {});
                }, 3000);
            });
        }
    }
}