const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js')
const posto = require('../models/posto.js')


module.exports = {
    data: new SlashCommandBuilder()
        .setName('add_posto')
        .setDescription('Registrar novo Posto')
        .addStringOption(option => option
            .setName('id_posto')
            .setDescription('Digite a placa a ser cadastrada')
            .setRequired(true),
        )
        .addStringOption(option => option
            .setName('id_dono')
            .setDescription('ID do dono do posto')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('nome_dono')
            .setDescription('Nome do dono do posto')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('num_dono')
            .setDescription('Número do dono do posto')
            .setRequired(true)
        ),
    async execute(interaction, client) {
        const id_posto = interaction.options.getString("id_posto")
        const id_dono = interaction.options.getString("id_dono")
        const nome_dono = interaction.options.getString("nome_dono")
        const num_dono = interaction.options.getString("num_dono")

        var verifica = 0
        let postos = await posto.find();
        for (let pos = 0; pos < postos.length; pos++) {
            if (postos[pos].id_posto === Number(id_posto)) {
                verifica = 1
            }
        }
        if (verifica === 0) {
            await posto.create({
                id_posto: interaction.options.getString("id_posto"),
                id_dono: interaction.options.getString("id_dono"),
                nome_dono: interaction.options.getString("nome_dono"),
                num_dono: interaction.options.getString("num_dono"),
                pago: false
            })

            var avatar = "https://cdn.discordapp.com/avatars/613559708543877121/a163b90262bc00cd200f768565ed6dfd.webp"
            if (interaction.user.avatarURL() != null) { avatar = interaction.user.avatarURL() }

            var embed = new Discord.MessageEmbed()
                .setColor('0xFFD700')
                .setTitle("⛽・Cadastro de Posto")
                .setDescription(`\u200b \n Posto cadastrado: \n \u200b `)
                .addFields({ name: `Posto: ${id_posto}`, value: `Dono: ${nome_dono} \n ID: ${id_dono} \n Número: ${num_dono} \n` })

                .setFooter({ text: "Comando /add_posto ", iconURL: avatar })
        } else {
            var embed = new Discord.MessageEmbed()
                .setColor('RED')
                .setTitle("⛽・Cadastro de Posto")
                .setDescription(`\u200b \n Posto Já cadastrado: \n \u200b `)
                .addFields({ name: `Posto: ${id_posto}`, value: `O posto já esta cadastrado \n` })

                .setFooter({ text: "Comando /add_posto ", iconURL: avatar })
        }

        interaction.reply({ embeds: [embed] })
    }
};

console.log('AddPosto: Carregado com sucesso');