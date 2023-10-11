const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with pong'),
    async execute(interaction) {
        console.log(interaction)
        interaction.reply({ content: 'Pong' })
    }
};
console.log('Ping: Carregado com sucesso');