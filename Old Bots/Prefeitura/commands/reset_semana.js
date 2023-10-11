const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js')
const posto = require('../models/posto')


module.exports = {
    data: new SlashCommandBuilder()
        .setName('reset_semana')
        .setDescription('Efetuar o rest de pagamentos'),

    async execute(interaction, client) {
        var avatar = "https://cdn.discordapp.com/avatars/613559708543877121/a163b90262bc00cd200f768565ed6dfd.webp"
        if (interaction.user.avatarURL() != null) { avatar = interaction.user.avatarURL() }

        const postoR = parseInt(interaction.options.getString("posto"))
        let verificar = 0
        try {
            await interaction.deferReply().catch((_) => { });
            let postos = await posto.find();
            for (let pos = 0; pos < postos.length; pos++) {
                    postos[pos].pago = false
                    postos[pos].save()            
            }

                const embed = new Discord.MessageEmbed()
                        .setColor("GREEN")
                        .setTitle('❗・Impostos Resetados')
                        .setDescription(`\u200b \n 
                        Todos postos tiveram seus impostos resetados.\n  \u200b`)
                        .setFooter({ text: "Comando /del_posto ", iconURL: avatar })

                    interaction.editReply({ embeds: [embed] });

        } catch (err) {
            console.error(err);
        }
    }
}
console.log('ResetSemana: Carregado com sucesso');