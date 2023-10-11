const Discord = require('discord.js')
const meta = require('../models/meta')
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lider_meta')
        .setDescription('Mostrar meta da semana.')
        .addStringOption(option => option
            .setName('mencion')
            .setDescription('Marque o usuário que deseja verificar!')
        ),

    async execute(interaction, client) {
        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            interaction.reply('<a:NAO:1005889521063305368> Você Não tem permição para utilizar este comando!!!')
        } else {

            var avatar = "https://cdn.discordapp.com/avatars/613559708543877121/a163b90262bc00cd200f768565ed6dfd.webp"
            if (interaction.user.avatarURL() != null) { avatar = interaction.user.avatarURL() }
            var userid = interaction.user.id
            const input = interaction.options.getString("mencion")
            if (input != null) {
                var userid = input.replace(/>/g, "").replace(/<@!/g, "").replace(/<@/g, "");
            }

            let verificar = 0
            try {
                await interaction.deferReply().catch((_) => { });
                let metas = await meta.find();
                let totalSujo = 0
                for (let pos = 0; pos < metas.length; pos++) {
                    if (metas[pos].id === userid) {
                        let valor = parseInt(metas[pos].dinhieiroS);
                        totalSujo = totalSujo + valor
                        verificar = 1
                    }
                }

                const embed = new Discord.MessageEmbed()
                    .setColor('BLURPLE')
                    .setTitle('Metas semanais')
                    .setDescription(`Metas semanais de **<@${userid}>** \n
                    Total de dinheiro sujo arrecadado: **R$ ${totalSujo}** \n \u200b`)
                    .setTimestamp()
                    .setFooter({ text: "Comando /meta ", iconURL: avatar })




                interaction.editReply({ embeds: [embed] });
            } catch (err) {
                console.error(err);
            }
        }
    }
}

console.log('Lider_meta: Carregado com sucesso');