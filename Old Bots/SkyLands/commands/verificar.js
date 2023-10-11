const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js')
const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js')


module.exports = {
    data: new SlashCommandBuilder()
        .setName('verificar')
        .setDescription('Criar botão de verificação')
        .setDMPermission(false),
    async execute(interaction, client) {
        const embed = new Discord.EmbedBuilder()
        .setColor(0x134294)
        .setTitle(`Verificação de ${interaction.guild.name}`)
        .setThumbnail(interaction.guild.iconURL())
        .setDescription('\u200b \n Clique no botão a baixo para verificar!!! \n \u200b ')
        .setTimestamp(new Date())



        const button = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
                .setCustomId("verificar")
                .setLabel('Verificar')
                .setEmoji('<a:817438197524201505:983125995064295486>')
                .setStyle(3)
                
        )

            const channel = client.channels.cache.get(interaction.channelId);
            channel.send({embeds: [embed] ,components: [button]});
            interaction.reply("\u200b")
            interaction.deleteReply()
        
    }
    
};

console.log('Verificar: Carregado com sucesso');