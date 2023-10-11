const { SlashCommandBuilder } = require('@discordjs/builders');
const config = require('../config.json')


module.exports = {
    data: new SlashCommandBuilder()
        .setName('exemplo')
        .setDescription('exemplo'),
    async execute(interaction, client) {
        interaction.reply({})
    }
};

console.log('exemplo: Carregado com sucesso');