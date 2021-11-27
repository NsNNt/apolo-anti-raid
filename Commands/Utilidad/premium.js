const Premium = require("../../Models/UserPremium");
const PremiumCode = require("../../Models/Premium");
const ms = require("ms");
const moment = require("moment");

module.exports = {
    name: "premium",
    aliases: ["canjear"],
    usage: "premium <Codigo>",
    description: "Canjea un codigo premium",
    /**
     * @param {Message} message
     */
    async execute(message, args, commandName, client, Discord) {
        let Codigo = args[0];
        const usuario = await Premium.findOne({ userId: message.author.id });
        if(usuario) {
            if(!usuario?.timestamp) {
                return message.reply({ content: "Ya cuentas con premium, valido hasta: `Infinito`", allowedMentions: { repliedUser: false } });
            } else {
                return message.reply({ content: `Ya cuentas con premium, valido hasta: \`${moment((usuario?.ctimestamp + usuario?.timestamp)).format("Do/MM/YYYY hh:mm:ss a").replace("º", "")}\``, allowedMentions: { repliedUser: false }  })
            }
        }
        if(!Codigo) {
            return message.reply({ content: "No has introducido ningun codigo para canjear", allowedMentions: { repliedUser: false } });
        } else {
            const codigo = await PremiumCode.findOne({ code: Codigo });
            if(!codigo) {
                return message.reply({ content: "Ese codigo no existe o ya fue canjeado", allowedMentions: { repliedUser: false } });
            }
            if(codigo?.redemmed) {
                return message.reply({ content: "Ese codigo no existe o ya fue canjeado", allowedMentions: { repliedUser: false } });
            }
            if(codigo?.time === 0) {
                const x0_244 = new Premium({
                    userId: message.author.id
                });
                await x0_244.save();
                codigo.redemmed = true;
                await codigo.save();
                message.reply({ content: "Codigo canjeado correctamente, ahora tienes premium hasta: `Infinito`", allowedMentions: { repliedUser: false } });
            } else {
                if(codigo?.time === 2592000000) {
                    const x0_244 = new Premium({
                        userId: message.author.id,
                        timestamp: Date.now(),
                        ctimestamp: ms('30d')
                    });
                    await x0_244.save();
                    codigo.redemmed = true;
                    await codigo.save();
                    console.log()
                    message.reply({ content: `Codigo canjeado correctamente, ahora tienes premium hasta: \`${(moment(ms("30d") + codigo?.timestamp)).format("Do/MMMM/YYYY hh:mm:ss a").replace("º", "")}\``, allowedMentions: { repliedUser: false } });
                }
                if(codigo?.time === 31557600000) {
                    const x0_244 = new Premium({
                        userId: message.author.id,
                        timestamp: Date.now(),
                        ctimestamp: ms('1y')
                    });
                    await x0_244.save();
                    codigo.redemmed = true;
                    await codigo.save();
                    console.log()
                    message.reply({ content: `Codigo canjeado correctamente, ahora tienes premium hasta: \`${(moment(ms("1y") + codigo?.timestamp)).format("Do/MMMM/YYYY hh:mm:ss a").replace("º", "")}\``, allowedMentions: { repliedUser: false } });
                }
            }
        }
    }
}