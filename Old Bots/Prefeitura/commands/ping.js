const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with pong'),
    async execute(interaction) {
        interaction.reply({ content: 'Pong' })
        const dias = new Date()
        console.log(dias, dias+1)
    }
};
console.log('Ping: Carregado com sucesso');