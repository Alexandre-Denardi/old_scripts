const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js')
const { MessageActionRow, MessageSelectMenu } = require('discord.js')


module.exports = {
    data: new SlashCommandBuilder()
        .setName('verificar')
        .setDescription('Criar botão de verificação'),
    async execute(interaction, client) {
        const embed = new Discord.MessageEmbed()
        .setColor('0xC3B8F9')
        .setTitle(`Verificação de ${interaction.guild.name}`)
        .setThumbnail(interaction.guild.iconURL())
        .setDescription('\u200b \n Clique no botão a baixo para verificar!!! \n \u200b ')
        .setTimestamp(new Date())



        const button = new Discord.MessageActionRow()
        .addComponents(
            new Discord.MessageButton()
                .setCustomId("verificar")
                .setLabel('Verificar')
                .setEmoji('<a:817438197524201505:983125995064295486>')
                .setStyle('SUCCESS')
                
        )

        const channel = client.channels.cache.get(interaction.channelId);
        channel.send({embeds: [embed] ,components: [button]});
        interaction.reply("\u200b")
        interaction.deleteReply()


    }
    
};

console.log('Verificar: Carregado com sucesso');