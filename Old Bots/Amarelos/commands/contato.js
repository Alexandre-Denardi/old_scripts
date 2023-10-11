const { SlashCommandBuilder } = require('@discordjs/builders');
const config = require('../config.json')
const Discord = require('discord.js')


module.exports = {
    data: new SlashCommandBuilder()
        .setName('contato')
        .setDescription('Adiciona o seu contato.')
        .addStringOption(option => option
            .setName('vulgo')
            .setDescription('Qual é o seu apelido?')
            .setRequired(true))
        .addStringOption(option => option
            .setName('numero')
            .setDescription('Qual é o seu número?')
            .setRequired(true)),
    async execute(interaction, client) {
        const nome = interaction.options.getString("vulgo")
        const numero = interaction.options.getString('numero');
        var avatar = "https://cdn.discordapp.com/avatars/613559708543877121/a163b90262bc00cd200f768565ed6dfd.webp"
        if (interaction.user.avatarURL() != null) { avatar = interaction.user.avatarURL() }

        const embed = new Discord.MessageEmbed()
            .setColor('0xFFD700')
            .setTitle("📕・Contato da Fac")
            .setDescription(`\u200b \n Vulgo: **${nome}** \n \n Número: **${numero}** \n \u200b `)
            .setFooter({ text: "Comando /contato ", iconURL: avatar })

        interaction.reply({embeds: [embed]})
    }
};

console.log('Contato: Carregado com sucesso');