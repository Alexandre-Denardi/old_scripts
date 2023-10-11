const { SlashCommandBuilder } = require('@discordjs/builders')
const Client = require('../index')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with pong')
        .setDMPermission(false),
    async execute(interaction, client) {
        interaction.reply({ content: `🏓 Pong \n ${client.ws.ping}ms` })
    }
};


console.log('Ping: Carregado com sucesso');