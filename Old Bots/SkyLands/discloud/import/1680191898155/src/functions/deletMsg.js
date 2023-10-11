const client = require('../../index')
const config = require('../../config.json')
const Discord = require('discord.js')

client.on("messageDelete", async (message) => {

    if (config.msgLog == null) return;
    if (message.author.bot) return;

    let user = message.author;
    let channelID = message.channel;
    let msgDelete = message.content;

    let embed = new Discord.EmbedBuilder()
        .setTitle('Mensagem Excluída')
        .setColor(0xad0207)
        .setTimestamp(new Date())
        .addFields(
            {
                name: 'Autor da mensagem: ',
                value: `${user}`,
                inline: true,
            },
            {
                name: 'De que canal foi apagado:',
                value: `${channelID}`,
                inline: true,
            }

        )
        .setFooter({ text: `${message.guild.name}`, iconURL: message.guild.iconURL({ dynamic: true }) })
        .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
    if (msgDelete != '') {
        embed.addFields(
            {
                name: 'Mensagem:',
                value: `${msgDelete}`,
            })
    }
    if (message.attachments.size >= 1) {
        var loc = 1
        for (var i = 0; i < message.attachments.size; i++) {
            embed.addFields({
                name: `Arquivo ${loc}:`,
                value: `${message.attachments.map(a => a.url)[i]}`
            })
            loc++
        }
    }

    message.guild.channels.cache.get(config.msgLog).send({ embeds: [embed] })
})

console.log( "Deletar MSG: Carregado com sucesso" )