const { GuildMember, Client, MessageEmbed, MessageAttachment } = require("discord.js")
const Verify = require("../../Models/Verify");
const VerifyRole = require("../../Models/VerifyRole");
const CaptchaIntents = require("../../Models/CaptchaIntents");
const { Captcha } = require("captcha-canvas");
const members = [];

module.exports = {
    name: "guildMemberAdd",
    /**
     * 
     * @param {GuildMember} member 
     */
    async execute(member) {
        if(member.user.bot) return;
        const vRLE = await VerifyRole.findOne({ guildId: member.guild.id });
        const vCL = await Verify.findOne({ guildId: member.guild.id });
        if(!vRLE && !vCL) {
            return;
        } else {
            const channel = member.guild.channels.cache.get(vCL?.channelId);
            const rol = member.guild.roles.cache.get(vRLE?.roleId);
            if(!channel && !rol) {
                return;
            } else {
                const captcha = new Captcha();
                captcha.async = true;
                captcha.addDecoy();
                captcha.drawTrace({
                    "color": "#EC02FF"
                });
                captcha.drawCaptcha({
                    "skew": true,
                    "color": "#fff",
                    colors: ["#fff", "#85FC57", "#A6FDFF"]
                });

                const cAtt = new MessageAttachment(
                    await captcha.png,
                    "captcha.png"
                );
                try {
                    const nCU = new CaptchaIntents({
                        userId: member.id,
                        guildId: member.guild.id,
                        intents: 3
                    });
                    await nCU.save();
                    await channel.send({ content: `${member}`, embeds: [{
                        "title": "¿Beep, Boop, Boop, Beep?",
                        "description": "Bienvenido `"+member.user.username+"`, completa este captcha para ser verificado en `"+member.guild.name+"`.\n\n`⇒` **¿Por qué se hace esto?**\n- Para combatir ataques con multicuentas/tokens.\n- Para mayor protección de el servidor.",
                        "color": 1154628,
                        "footer": {
                        "text": "Tienes 3 minutos y 3 intentos para contestar el captcha.",
                        "icon_url": "https://cdn-icons-png.flaticon.com/512/3039/3039437.png"
                        },
                        "image": {
                        "url": "attachment://captcha.png"
                        }
                    }], files: [cAtt] });
                    const collector = channel.createMessageCollector({ filter: (m) => m.author.id === member.id, time: 180000 });
                    collector.on('collect', async (m) => {
                    if(m.content !== captcha.text) {
                        if(nCU.intents - 1 === 0) {
                            member.send({ content: `El captcha es incorrecto, haz sido expulsado de \`${member.guild.name}\`` }).catch(e => {});
                        	member.guild.members.kick(member.id, "No resolvio correctamente el captcha.");
                            collector.stop();
                        } else {
                            nCU.intents = nCU.intents - 1;
                            await nCU.save();
                            channel?.send({ embeds: [
                                {
                                    title: "Captcha incorrecto",
                                    description: `Ese no es el captcha correcto, te quedan \`${nCU.intents}\` intentos.`,
                                    color: "BLURPLE",
                                    thumbnail: {
                                        "url": "https://cdn-icons-png.flaticon.com/512/3039/3039437.png"
                                    }
                                }
                            ] });
                        }
                    } else {
                        member.roles.add(rol.id, "Captcha completado").then(async () => {
                            channel?.send({ content: "Te has verificado correctamente." });
                            collector.stop();
                            await CaptchaIntents.findOneAndDelete({ userId: member.id, guildId: member.guild.id });
                        }).catch(e => {});
                    }
                    })
                    const ctxt = cT.first().content;
                } catch (e) {

                }
            }
        }
    }
}