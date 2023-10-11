const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js')
const placa = require('../models/placa')


module.exports = {
    data: new SlashCommandBuilder()
        .setName('rem_placa')
        .setDescription('Remover uma placa.')
        .addStringOption(option => option
            .setName('placa')
            .setDescription('Digite a placa a ser removida')
            .setRequired(true)
        ),
    async execute(interaction, client) {
        var avatar = "https://cdn.discordapp.com/avatars/613559708543877121/a163b90262bc00cd200f768565ed6dfd.webp"
        if (interaction.user.avatarURL() != null) { avatar = interaction.user.avatarURL() }

        const placaR = interaction.options.getString("placa").toUpperCase()
        let verificar = 0
        try {
            await interaction.deferReply().catch((_) => { });
            let placas = await placa.find();
            for (let pos = 0; pos < placas.length; pos++) {
                if (placas[pos].placa === placaR) {
                    placas[pos].remove()

                    const embed = new Discord.MessageEmbed()
                        .setColor('GREEN')
                        .setTitle('✅・Placa Removida')
                        .setDescription(`\u200b \n 
                        A placa: **${placaR}** \n
                        Foi removida do nosso banco de dados.\n  \u200b`)
                        .setFooter({ text: "Comando /rem_placa ", iconURL: avatar })

                    verificar = 1
                    interaction.editReply({ embeds: [embed] });

                }
            }

            if (verificar === 0) {

                const embed = new Discord.MessageEmbed()
                        .setColor('RED')
                        .setTitle('🚫・Placa Não encontrada')
                        .setDescription(`\u200b \n 
                        A placa: **${placaR}** \n
                        Não foi encontrada no nosso banco de dados.\n  \u200b`)
                        .setFooter({ text: "Comando /rem_placa ", iconURL: avatar })

                    interaction.editReply({ embeds: [embed] });

            }
        } catch (err) {
            console.error(err);
        }
    }
}
console.log('Rem Placa: Carregado com sucesso');