const { Client, GuildMember, MessageEmbed } = require("discord.js");
const Blacklist = require("../../Models/Blacklist");

module.exports = {
    name: "guildCreate",
    /**
     * @param {Client} Client
     */
     async execute(guild, client) {
        if(guild.memberCount < 15) {
            client.users.cache.get(guild.ownerId).send({ content: `El servidor \`${guild.name}\` tiene menos de 15 miembros, he salido de el.` }).catch(e => {});
            guild.leave().catch(e => {});
            return;
        }
        const blacklist = await Blacklist.findOne({ userId: guild.ownerId });
        if(blacklist) {
            return client.users.cache.get(guild.ownerId).send({ content: "No puedo interactuar con usuarios en la lista negra" }).catch(e => {});
            guild.leave();
        }
        client.users.cache.get(guild.ownerId).send({ content: "> ¡Hola, gracias por añadirme a tu servidor!\n\n> `-` __Consejos útiles de configuración:__\n\n- - > Para configurarme contra raids puedes usar el comando `ap!anti-raid`\n- - > Para configurarme contra maliciosos puedes usar el comando `ap!anti-malicious`\n- - > Para más información utiliza `ap!comandos`\n- - > ¿Necesitas moderadores en tu servidor? Olvidalo! ahora solo sera cuestion de **Apolo** utiliza `ap!auto-moderador`\n\n> `-` __Servidor de Soporte__\nhttps://discord.gg/ZQCcer2XsF\n\n> - Enviado desde: `"+guild.name+"`" }).catch(e => {});
         client.channels.cache.get("909883576902877274").send({ content: `Me metieron a un servidor ${guild.name} | ${guild.id}, tiene ${guild.memberCount}` });
     }
}