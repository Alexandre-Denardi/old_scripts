const { SlashCommandBuilder } = require('@discordjs/builders');
const posto = require('../models/posto')
const Discord = require('discord.js');
const verificar = require('./verificar');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('posto')
        .setDescription('Buscar posto cadastrado')
        .addStringOption(option => option
            .setName('posto')
            .setDescription('Digite o ID para verificar')
            .setRequired(true)
        ),
    async execute(interaction, client) {
        var avatar = "https://cdn.discordapp.com/avatars/613559708543877121/a163b90262bc00cd200f768565ed6dfd.webp"
        if (interaction.user.avatarURL() != null) { avatar = interaction.user.avatarURL() }

        const postoC = parseInt(interaction.options.getString("posto"))
        let verificar = 0
        try {
            await interaction.deferReply().catch((_) => { });
            let postos = await posto.find();
            for (let pos = 0; pos < postos.length; pos++) {
                if (postos[pos].id_posto === postoC) {

                    var stats  = "Não PAGO"
                    var color = "RED"
                    if(postos[pos].pago === true) {
                        stats = "PAGO"
                        color = "GREEN"
                    } 

                    const embed = new Discord.MessageEmbed()
                        .setColor(color)
                        .setTitle('🎟・Posto está cadastrado')
                        .setDescription(`\u200b \n 
                    O Posto: **${postoC}** \n
                    Este posto está cadastrado conforme os seguintes dados\n `)
                    .addFields(
                        {name:`Dados:` , value: 
                    `Dono: **${postos[pos].nome_dono}**
                    Passaporte: **${postos[pos].id_dono}**
                    Número: **${postos[pos].num_dono}**

                    Status da licença: **${stats}**
                    \u200b`
                }
                    )
                        .setTimestamp()
                        .setFooter({ text: "Comando /posto ", iconURL: avatar })

                    verificar = 1
                    interaction.editReply({ embeds: [embed] });

                }
            }

            if (verificar === 0) {
                const embed = new Discord.MessageEmbed()
                    .setColor('GREY')
                    .setTitle('🎟・Posto não cadastrado')
                    .setDescription(`\u200b \n 
            O Posto: **${postoC}** \n
            Não está cadastrado no nosso banco de dados\n  \u200b`)
                    .setTimestamp()
                    .setFooter({ text: "Comando /posto ", iconURL: avatar })

                interaction.editReply({ embeds: [embed] });
            }



        } catch (err) {
            console.error(err);

        }
    }
}

console.log('Posto: Carregado com sucesso');