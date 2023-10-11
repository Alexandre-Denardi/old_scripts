const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js')
const placa = require('../models/placa')


module.exports = {
    data: new SlashCommandBuilder()
        .setName('add_placa')
        .setDescription('Registrar nova placa')
        .addStringOption(option => option
            .setName('placa')
            .setDescription('Digite a placa a ser cadastrada')
            .setRequired(true)
        ),
    async execute(interaction, client) {
        const placaT = interaction.options.getString("placa").toUpperCase()

        await placa.create({
            placa: placaT,
        })
        var avatar = "https://cdn.discordapp.com/avatars/613559708543877121/a163b90262bc00cd200f768565ed6dfd.webp"
        if (interaction.user.avatarURL() != null) { avatar = interaction.user.avatarURL() }

        const embed = new Discord.MessageEmbed()
            .setColor('0xFFD700')
            .setTitle("🚗・Cadastro de Placa")
            .setDescription(`\u200b \n Placa cadastrada: **${placaT}**  \n \u200b `)
            .setFooter({ text: "Comando /add_placa ", iconURL: avatar })

        interaction.reply({embeds: [embed]})
    }
};

console.log('Add Placa: Carregado com sucesso');