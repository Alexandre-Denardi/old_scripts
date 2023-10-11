const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const Discord = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('painel-meta')
        .setDescription('Use esse comando para criar o menu de metas'),
    async execute(interaction, client) {

        //Embed para as metas
        const embed = new Discord.MessageEmbed()
            .setColor('0xFFD700')
            .setTitle("✅・Metas da Fac")
            .setDescription(`\u200b \n **Clique no botão para abrir o menu das metas** \n \u200b `)


        //Botão para abrir o painel 
        const button = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                    .setCustomId("metaButton")
                    .setLabel('Adicionar')
                    .setEmoji('🗳')
                    .setStyle('SUCCESS')
            )


        interaction.reply({embeds: [embed], components: [button]})
    }
};

console.log('PainelMeta: Carregado com sucesso');