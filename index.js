const Discord = require("discord.js");
const intents = new Discord.Intents(32767);
const client = new Discord.Client({ intents: intents });
const mongoose = require("mongoose");
require("dotenv").config();
module.exports = client;
const moment = require("moment");
moment.updateLocale('es', {
    months: '01_02_03_04_05_06_07_08_09_10_11_12'.split('_'),
    monthsShort: 'Enero._Feb._Mar_Abr._May_Jun_Jul._Ago_Sept._Oct._Nov._Dec.'.split('_'),
    weekdays: 'Domingo_Lunes_Martes_Miercoles_Jueves_Viernes_Sabado'.split('_'),
    weekdaysShort: 'Dom._Lun._Mar._Mier._Jue._Vier._Sab.'.split('_'),
    weekdaysMin: 'Do_Lu_Ma_Mi_Ju_Vi_Sa'.split('_')
});

mongoose.connect('tu dbbbbbb');

mongoose.connection.on('open', () => console.log("DB Abierta <3"));

mongoose.connection.on('close', () => console.log("DB Cerrada..."));

client.cooldowns = new Discord.Collection();
client.commands = new Discord.Collection();

client.on('shardError', (e, s) => {
    console.log(`[ERRORS]: Un error ocurrio en el shard #${s}: ${e}`);
});


['eventsHandler', 'commandsHandler'].forEach(handler => {
    require(`./Handlers/${handler}`)(client, Discord);
});

client.login(process.env.TOKEN);