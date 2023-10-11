const client = require('../../index')
const Discord = require('discord.js');
const config = require('../../config.json')


client.on("guildMemberAdd", async (member) => {
    let embed_newMember = new Discord.EmbedBuilder()

        .setAuthor({ name: `${member.user.username}`, iconURL: member.user.avatarURL() })
        .setTitle(`👋Bem-vindo(a)!`)
        .setDescription(` Olá ${member}, seja bem vindo ao melhor servidor de RP deste ano...`)
        .setColor(0xC3B8F9)
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .setFooter({ text: `User ID: ${member.user.id}`, iconURL: member.user.avatarURL() })

    member.guild.channels.cache.get(config.logEntrada).send({ embeds: [embed_newMember] })

})
client.on("guildMemberRemove", async (member) => {
    let embed_remMember = new Discord.EmbedBuilder()

        .setAuthor({ name: `${member.user.username}`, iconURL: member.user.avatarURL() })
        .setDescription(` 🗑 Um membro saiu do serivdor 🗑 \n \n ${member} `)
        .setColor(0xad0207)
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .setFooter({ text: `User ID: ${member.user.id}`, iconURL: member.user.avatarURL() })

    member.guild.channels.cache.get(config.logSaida).send({ embeds: [embed_remMember] })

})

console.log("log : Carregado com sucesso")
