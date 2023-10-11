const client = require('../../index')
const config = require('../../config.json')
const Discord = require('discord.js')
const db = require("../../DB/app")

client.on("voiceStateUpdate", async (oldMember, newMember) => {


    let oldVoice = oldMember.channelId;
    let newVoice = newMember.channelId;
    let ID = oldMember.id
    let usuario = newMember.guild.members.cache.get(ID)


    if (oldVoice == null) {
        let embed = new Discord.EmbedBuilder()
            .setTitle('Entrou em canal de voz')
            .setDescription(`O membro <@${ID}> entrou no canal de voz <#${newVoice}>.`)
            .setThumbnail(usuario.displayAvatarURL({ dynamic: true }))
            .setTimestamp(new Date())
            .setColor(0x02b31f);


        // Registra no banco a hora que entrou
        (async () => {
            const ServerID = oldMember.guild.id
            const UserID = oldMember.id
            const Entrada = new Date()
            await db.HoraEntrada(ServerID, UserID, Entrada)
        })();

        // Envia a log
        oldMember.guild.channels.cache.get(config.logCall).send({ embeds: [embed] })


    } else if (oldVoice != null && newVoice != null && oldVoice != newVoice) {
        let embed = new Discord.EmbedBuilder()
            .setTitle('Trocou em canal de voz')
            .setDescription(`O membro <@${ID}> \n Saiu de <#${oldVoice}> \n Entrou no canal de voz  <#${newVoice}>. \n \u200b`)
            .setThumbnail(usuario.displayAvatarURL({ dynamic: true }))
            .setTimestamp(new Date())
            .setColor(0xC3B8F9)

        oldMember.guild.channels.cache.get(config.logCall).send({ embeds: [embed] })

    } else if (oldVoice != null && newVoice == null) {
        let embed = new Discord.EmbedBuilder()
            .setTitle('Saiu dos canais de voz')
            .setDescription(`O membro <@${ID}> saiu do canal de voz <#${oldVoice}> e não voltou mais.`)
            .setThumbnail(usuario.displayAvatarURL({ dynamic: true }))
            .setTimestamp(new Date())
            .setColor(0xad0207);


        // Registrando hora saida 

        const ServerID = oldMember.guild.id
        const UserID = oldMember.id
        const Saida = new Date()
        await db.HoraSaida(ServerID, UserID, Saida);

        const lastCall = await db.ContadorLastCall(ServerID, UserID)
        let formattedTime = '';

        if (lastCall.length != 0) {
            const henter = new Date(lastCall[0].DEnter);
            const hexit = new Date(lastCall[0].DExit);

            const diffInMilliseconds = hexit - henter;
            const diffInSeconds = diffInMilliseconds / 1000;

            const days = Math.floor(diffInSeconds / 86400);
            const remainingSeconds = diffInSeconds % 86400;

            const hours = Math.floor(remainingSeconds / 3600);
            const minutes = Math.floor((remainingSeconds % 3600) / 60);
            const seconds = Math.floor(remainingSeconds % 60);

            if (days > 0) {
                formattedTime += days + ' dias ';
            }

            formattedTime +=
                hours.toString().padStart(2, '0') + ':' +
                minutes.toString().padStart(2, '0') + ':' +
                seconds.toString().padStart(2, '0');

                let totalSeconds = parseInt(diffInSeconds);
                db.UpdateRanking(ServerID, UserID, totalSeconds)
        } else {
            formattedTime = "Sem hora de entrada registrada"
        }

        embed.addFields({name:'🕑 Tempo em call: ', value: `${formattedTime}`});


        oldMember.guild.channels.cache.get(config.logCall).send({ embeds: [embed] })
    }
})

console.log("log Voice: Carregado com sucesso")