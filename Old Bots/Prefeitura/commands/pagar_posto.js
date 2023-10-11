const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js')
const posto = require('../models/posto')


module.exports = {
    data: new SlashCommandBuilder()
        .setName('pagar_posto')
        .setDescription('Efetuar o pagamento de um posto.')
        .addStringOption(option => option
            .setName('posto')
            .setDescription('Digite o Id do posto a ser pago!')
            .setRequired(true)
        ),
    async execute(interaction, client) {
        var avatar = "https://cdn.discordapp.com/avatars/613559708543877121/a163b90262bc00cd200f768565ed6dfd.webp"
        if (interaction.user.avatarURL() != null) { avatar = interaction.user.avatarURL() }

        const postoR = parseInt(interaction.options.getString("posto"))
        let verificar = 0
        try {
            await interaction.deferReply().catch((_) => { });
            let postos = await posto.find();
            for (let pos = 0; pos < postos.length; pos++) {
                if (postos[pos].id_posto === postoR) {
                    postos[pos].pago = true
                    postos[pos].save()

                    const embed = new Discord.MessageEmbed()
                        .setColor('GREEN')
                        .setTitle('✅・Posto Pago')
                        .setDescription(`\u200b \n 
                        O Posto: **${postoR}** \n
                        Foi pago.\n  \u200b`)
                        .setFooter({ text: "Comando /pagar_posto ", iconURL: avatar })

                    verificar = 1
                    interaction.editReply({ embeds: [embed] });

                }
            }

            if (verificar === 0) {

                const embed = new Discord.MessageEmbed()
                        .setColor('RED')
                        .setTitle('🚫・Posto não encontrado')
                        .setDescription(`\u200b \n 
                        O Posto: **${postoR}** \n
                        Não foi encontrado no nosso banco de dados.\n  \u200b`)
                        .setFooter({ text: "Comando /del_posto ", iconURL: avatar })

                    interaction.editReply({ embeds: [embed] });

            }
        } catch (err) {
            console.error(err);
        }
    }
}
console.log('PagarPosto: Carregado com sucesso');