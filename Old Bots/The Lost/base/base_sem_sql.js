const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js')


module.exports = {
    data: new SlashCommandBuilder()
        .setName('exemplo')
        .setDescription('exemplo'),
    async execute(interaction, client) {
        interaction.reply({})
    }
};

console.log('exemplo: Carregado com sucesso');