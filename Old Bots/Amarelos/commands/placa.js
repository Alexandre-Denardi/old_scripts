const { SlashCommandBuilder } = require('@discordjs/builders');
const placa = require('../models/placa')
const Discord = require('discord.js');
const verificar = require('./verificar');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('placa')
        .setDescription('Buscar placa cadastrada')
        .addStringOption(option => option
            .setName('placa')
            .setDescription('Digite a placa para verificar')
            .setRequired(true)
        ),
    async execute(interaction, client) {
        var avatar = "https://cdn.discordapp.com/avatars/613559708543877121/a163b90262bc00cd200f768565ed6dfd.webp"
        if (interaction.user.avatarURL() != null) { avatar = interaction.user.avatarURL() }

        const placaC = interaction.options.getString("placa").toUpperCase()
        let verificar = 0
        try {
            await interaction.deferReply().catch((_) => { });
            let placas = await placa.find();
            for (let pos = 0; pos < placas.length; pos++) {
                if (placas[pos].placa === placaC) {

                    const embed = new Discord.MessageEmbed()
                        .setColor('RED')
                        .setTitle('🎟・Placa está cadastrada')
                        .setThumbnail('https://cdn.discordapp.com/attachments/1006334857443541083/1006334935772168264/nao.gif')
                        .setDescription(`\u200b \n 
                    A placa: **${placaC}** \n
                    Esta placa está cadastrada no nosso banco dados\n 
                    \n
                    **Não desmanche este veiculo**\n \u200b`)
                        .setTimestamp()
                        .setFooter({ text: "Comando /placa ", iconURL: avatar })

                    verificar = 1
                    interaction.editReply({ embeds: [embed] });

                }
            }

            if (verificar === 0) {
                const embed = new Discord.MessageEmbed()
                    .setColor('GREEN')
                    .setTitle('🎟・Placa não está cadastrada')
                    .setThumbnail('https://cdn.discordapp.com/attachments/1006334857443541083/1006334936795586730/sim.gif')
                    .setDescription(`\u200b \n 
            A placa: **${placaC}** \n
            Não está cadastrada no nosso banco dados\n 
            \n
            **Você pode desmanchar este veiculo**\n \u200b`)
                    .setTimestamp()
                    .setFooter({ text: "Comando /placa ", iconURL: avatar })

                interaction.editReply({ embeds: [embed] });
            }



        } catch (err) {
            console.error(err);

        }
    }
}

console.log('Placa: Carregado com sucesso');