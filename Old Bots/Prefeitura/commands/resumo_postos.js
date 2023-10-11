const { SlashCommandBuilder } = require('@discordjs/builders');
const posto = require('../models/posto')
const Discord = require('discord.js');
const verificar = require('./verificar');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('resumo_posto')
        .setDescription('Resumo geral de todos postos cadastrados'),

    async execute(interaction, client) {
        var avatar = "https://cdn.discordapp.com/avatars/613559708543877121/a163b90262bc00cd200f768565ed6dfd.webp"
        if (interaction.user.avatarURL() != null) { avatar = interaction.user.avatarURL() }

        cont = 0
        contn = 0
        lis_cont = []
        lis_nao = []
        try {

            const embed = new Discord.MessageEmbed()
                .setTitle('🖥・Resumo')
                .setTimestamp()
                .setFooter({ text: "Comando /resumo_posto ", iconURL: avatar })
            await interaction.deferReply().catch((_) => { });
            let postos = await posto.find();
            for (let pos = 0; pos < postos.length; pos++) {
                if (postos[pos].pago === true) {
                    cont++
                    lis_cont.push(postos[pos].id_posto)
                } else {
                    contn++
                    lis_nao.push(postos[pos].id_posto)
                }
            }

            porcentagem = 100*cont/(cont+contn)

            embed.setDescription(` A porcentagem de postos pagos é de **${porcentagem.toFixed(2)}%**`)

            const pagos = lis_cont.toString().replace(/,/g, "\n");
            const npagos = lis_nao.toString().replace(/,/g, "\n");

                if(pagos != 0) {
                embed.addFields( { name: `Pagos`, value: pagos , inline: true})}
                if(npagos != 0) {
                embed.addFields( { name: `Não Pagos`, value: npagos, inline: true })}
            if (porcentagem >= 80) {
                embed.setColor('GREEN')
            } else {
                embed.setColor('RED')
            } 

            interaction.editReply({ embeds: [embed] });
        } catch (err) {
            console.error(err);

        }

    }
}

console.log('ResumoPosto: Carregado com sucesso');