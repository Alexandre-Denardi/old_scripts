const client = require('../../index')
const config = require('../../config.json')
const Discord = require('discord.js')

client.on("messageUpdate", async (message, oldMessage) => {


    if (config.msgLog == null) return;

    if (message.author.bot) return;

    let user = message.author
    let channelID = message.channel;
    let msgOld = message.content;
    let msgNew = oldMessage.content;

    if (msgNew != msgOld) {
        let embed = new Discord.EmbedBuilder()
            .setTitle('Mensagem Editada')
            .setColor(0xC3B8F9)
            .setTimestamp(new Date())
            .addFields(
                {
                    name: 'Autor da mensagem: ',
                    value: `${user}`,
                    inline: true,
                },
                {
                    name: 'De que canal foi editada:',
                    value: `${channelID}`,
                    inline: true,
                },
                {
                    name: 'Mensagem antiga:',
                    value: `${msgOld}`
                },
                {
                    name: 'Nova mensagem:',
                    value: `${msgNew}`
                }
            )
            .setFooter({ text: `${message.guild.name}`, iconURL: message.guild.iconURL({ dynamic: true }) })
            .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))


        message.guild.channels.cache.get(config.msgLog).send({ embeds: [embed] })
    }

})

console.log( "Editar MSG: Carregado com sucesso" )