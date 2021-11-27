const { MessageEmbed, MessageActionRow, Message, MessageButton } = require("discord.js");
const ModLogs = require("../../Models/modLogs");
const RaidLogs = require("../../Models/RaidLogs");
const AntiPalabras = require("../../Models/AntiPalabras");
const AutoModerador = require("../../Models/AutoModerador");
const AntiBots = require("../../Models/AntiBots");
const AntiChannels = require("../../Models/AntiChannels");
const AntiRoles = require("../../Models/AntiRoles");
const AntiTokens = require("../../Models/AntiTokens");
const AntiRaid = require("../../Models/AntiRaid");
const Malicious = require("../../Models/Malicious");
const emojis = require("../../emojis");

module.exports = {
    name: "status",
    aliases: ["configuracion", "st", 'sv'],
    description: "Configuraciones de tu servidor",
    cooldown: 5,
    /**
     * @param {Message} message
     */
    async execute(message, args, commandName, client, Discord) {
        let antilinks;
        let antipalabras;
        let automoderador;
        let antibots;
        let anticanales;
        let antiroles;
        let antitokens;
        let antiraid;
        let malicious;
        let raidlogs;
        let modlogs;
        const Embed = new MessageEmbed()
        .setDescription(`${emojis.cargando} | \`Espera un momento, estoy recolectando la configuración de este servidor en mi base de datos.\``)
        .setColor("BLUE")
        let msg = await message.reply({ embeds: [Embed], allowedMentions: { repliedUser: false } });
        const Antipalabras = await AntiPalabras.findOne({ guildId: message.guild.id });
        const Automoderador = await AutoModerador.findOne({ guildId: message.guild.id });
        const Antibots = await AntiBots.findOne({ guildId: message.guild.id });
        const Anticanales = await AntiChannels.findOne({ guildId: message.guild.id });
        const Antiroles = await AntiRoles.findOne({ guildId: message.guild.id });
        const Antitokens = await AntiTokens.findOne({ guildId: message.guild.id });
        const Antiraid = await AntiRaid.findOne({ guildId: message.guild.id });
        const Mlicious = await Malicious.findOne({ guildId: message.guild.id });
        const Raidlogs = await RaidLogs.findOne({ guildId: message.guild.id });
        let lastRolesCreator;
        let lastRolesDelete;
        let lastChannelCreate;
        let lastChannelDelete;
        let lastBotJoin;
        let lastBotOwnerJoin;
        let channelRaidLogs;
        let lastKicker;
        let lastBanner;
        let lastBanned;
        let lastKicked;
        const rolesCreateLogs = await message.guild.fetchAuditLogs({
            type: "ROLE_CREATE",
            limit: 1
        });
        const rolesDeleteLogs = await message.guild.fetchAuditLogs({
            type: "ROLE_DELETE",
            limit: 1
        });
        const channelCreateLogs = await message.guild.fetchAuditLogs({
            type: "CHANNEL_CREATE",
            limit: 1
        });
        const channelDeleteLogs = await message.guild.fetchAuditLogs({
            type: "CHANNEL_DELETE",
            limit: 1
        });
        const botJoinedLogs = await message.guild.fetchAuditLogs({
            type: "BOT_ADD",
            limit: 1
        });
        const bannedLogs = await message.guild.fetchAuditLogs({
            type: "BAN_MEMBER_ADD",
            limit: 1
        });
        const kickedLogs = await message.guild.fetchAuditLogs({
            type: "MEMBER_KICK",
            limit: 1
        });
        if(!bannedLogs) {
            lastBanner = "Ninguno.";
            lastBanned = "Nadie.";
        }
        if(!kickedLogs) {
            lastKicker = "Ninguno.";
            lastKicked = "Nadie.";
        }
        if(!botJoinedLogs) {
            lastBotJoin = "Ninguno.";
            lastBotOwnerJoin = "Nadie.";
        }
        if(!rolesCreateLogs) {
            lastRolesCreator = "Nadie."
        }
        if(!rolesDeleteLogs) {
            lastRolesDelete = "Nadie."
        }
        if(!channelCreateLogs) {
            lastChannelCreate = "Nadie."
        }
        if(!channelDeleteLogs) {
            lastChannelDelete = "Nadie."
        }
        lastRolesCreator = rolesCreateLogs.entries.first() ? rolesCreateLogs.entries.first().executor.tag : "Nadie.";
        lastRolesDelete = rolesDeleteLogs.entries.first() ? rolesDeleteLogs.entries.first().executor.tag : "Nadie.";
        lastChannelCreate = channelCreateLogs.entries.first() ? channelCreateLogs.entries.first().executor.tag : "Nadie.";
        lastChannelDelete = channelDeleteLogs.entries.first() ? channelDeleteLogs.entries.first().executor.tag : "Nadie.";
        lastBotJoin = botJoinedLogs.entries.first() ? botJoinedLogs.entries.first().target.tag : "Ninguno.";
        lastBotOwnerJoin = botJoinedLogs.entries.first() ? botJoinedLogs.entries.first().executor.tag : "Nadie.";
        lastKicker = kickedLogs.entries.first() ? kickedLogs.entries.first().executor.tag : "Nadie.";
        lastBanner = bannedLogs.entries.first() ? bannedLogs.entries.first().executor.tag : "Ninguno."; 
        lastBanned = bannedLogs.entries.first() ? bannedLogs.entries.first().target.tag : "Ninguno.";
        lastKicked = kickedLogs.entries.first() ? kickedLogs.entries.first().target.tag : "Nadie.";
        if(!Mlicious) {
            malicious = "No activado"
        } else {
            if(Mlicious?.actived) {
                malicious = "Esta activado"
            } else {
                malicious = "No activado"
            }
        }
        if(!Raidlogs) {
            raidlogs = "No esta activado"
        } else {
            if(Raidlogs?.actived) {
                const findCanal = client.channels.cache.get(Raidlogs?.channelId);
                if(!findCanal) {
            		channelRaidLogs = "El canal no existe."
                } else {
                    channelRaidLogs = findCanal.name;
                }
                raidlogs = "Esta activado"
            } else {
                raidlogs = "No esta activado"
            }
        }
        if(!Antiraid) {
            antiraid = "No activado"
        } else {
            if(Antiraid?.actived) {
                antiraid = "Esta activado"
            } else {
                antiraid = "No activado"
            }
        }
        if(!Antitokens) {
            antitokens = "No activado"
        } else {
            if(Antitokens?.actived) {
                antitokens = "Esta activado"
            } else {
                antitokens = "No activado"
            }
        }
        if(!Antipalabras) {
            antipalabras = "No activado"
        } else {
            if(Antipalabras?.actived) {
                antipalabras = "Esta activado"
            } else {
                antipalabras = "No activado"
            }
        }
        if(!Antiroles) {
            antiroles = "No activado"
        } else {
            if(Antiroles?.actived) {
                antiroles = "Esta activado"
            } else {
                antiroles = "No activado"
            }
        }
        if(!Anticanales) {
            anticanales = "No activado"
        } else {
            if(Anticanales?.actived) {
                anticanales = "Esta activado"
            } else {
                anticanales = "No activado"
            }
        }
        if(!Antibots) {
            antibots = "No activado"
        } else {
            if(Antibots?.actived) {
                antibots = "Esta activado"
            } else {
                antibots = "No activado"
            }
        }
        if(!Automoderador) {
            automoderador = "No activado"
        } else {
            if(Automoderador?.actived) {
                automoderador = "Esta activado"
            } else {
                automoderador = "No activado"
            }
        }
        const Response = new MessageEmbed()
        .setDescription(` ⛔ - RaidLogs: \`${Raidlogs?.actived ? "Los logs de raid estan activados en el servidor, los envio en: "+channelRaidLogs+"." : "Los logs de raid no esta activados."}\` `)
        .addField("🤬 Anti Palabras", `Activado: \`${antipalabras}\``, true)
        .addField("🔨 Auto Moderador", `Activado: \`${automoderador}\``, true)
        .addField("🤖 Anti Bots", `Activado: \`${antibots}\`\nLastBot: \`${lastBotJoin}\`\nLastBotFor: \`${lastBotOwnerJoin}\``, true)
        .addField("⛓ Anti Canales", `Activado: \`${anticanales}\`\nLastCreator: \`${lastChannelCreate}\`\nLastDeleter: \`${lastChannelDelete}\``, true)
        .addField("📰 Anti Roles", `Activado: \`${antiroles}\`\nLastCreator: \`${lastRolesCreator}\`\nLastDeleter: \`${lastRolesDelete}\``, true)
        .addField("🔍 Anti Tokens", `Activado: \`${antitokens}\``, true)
        .addField("🛡 Anti Raid", `Activado: \`${antiraid}\``, true)
        .addField("🕵🏻‍♀️ Anti Maliciosos", `Activado: \`${malicious}\`\nLastMaliciousEntry: \`${Mlicious?.lastMaliciousDetected ? Mlicious?.lastMaliciousDetected : "Nadie."}\``, true)
        .addField("⚠ Last Raid Logs", `LastBanPunisher: \`${lastBanner}\`\n LastKickPunisher: \`${lastKicker}\``, true)
        .setColor("BLUE")
        .setFooter(`${message.guild.name}`, message.guild.iconURL({ dynamic: true }) || client.user.displayAvatarURL({ dynamic: true }))
        .setTimestamp()
        
        const Consejos = new MessageEmbed()
        .setDescription(`(1) - Se recomienda activar el sistema \`antibots\`, esto evitara entradas de bots no verificados.\n(2) - Se recomienda tener el rol de **Apolo** en lo más alto para evitar ataques.\n(3) - Se recomienda tener activado el sistema \`anti-raid\` y configurarlo, esto evitara ataques futuros.\n(4) - Se recomienda tener activado el sistema \`antitokens\` para evitar ataques con multicuentas`)
        .setThumbnail(message.guild.iconURL({ dynamic: true }) || client.user.displayAvatarURL({ dynamic: true }))
        .setColor("BLUE")
        .setTimestamp()
        .setFooter(message.guild.name)
        msg.edit({ embeds: [Response, Consejos], allowedMentions: { repliedUser: false } });
    }
}