const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const adv = require('../models/adv');
const ms = require('ms');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('adv')
        .setDescription('Advertir um usuário')
        .addUserOption(option => option
            .setName('userid')
            .setDescription('Mencione o usuário ou coloque o ID')
            .setRequired(true))
        .addStringOption(option => option
            .setName('motivo')
            .setDescription('Descreva o motivo da advertência')),


    //Execução        
    async execute(interaction, client) {

        // Criando Resposta
        const embed = new Discord.MessageEmbed()
            .setColor("0xFFFF00")
            .setTitle('\n ⚠ Advertência ⚠')
            .setFooter({ text: "Comando /adv ", iconURL: avatar })


        // Verifica ADM
        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            interaction.reply('<a:NAO:1005889521063305368> Você Não tem permição para utilizar este comando!!!')
        } else {

            // Criando avatar
            var avatar = "https://cdn.discordapp.com/avatars/613559708543877121/a163b90262bc00cd200f768565ed6dfd.webp"
            if (interaction.user.avatarURL() != null) { avatar = interaction.user.avatarURL() }


            let usuario = interaction.options.getUser('userid')
            let userR = interaction.guild.members.cache.get(usuario.id)


            // Setando motivo

            if (interaction.options.getString('motivo') != null) {
                motivoc = interaction.options.getString('motivo')
            } else {
                motivoc = "Sem motivo especificado"
            }

            let existe = 0
            let nadvs = 0

            try {
                await interaction.deferReply().catch((_) => { });
                let advs = await adv.find();
                for (let pos = 0; pos < advs.length; pos++) {

                    // Caso ja tenha adv
                    if (advs[pos].UserId === userR) {
                        existe = 1
                        let addadvs = advs[pos].Adv
                        addadvs.push(motivoc)

                        advs[pos].Nadv++
                        nadvs = advs[pos].Nadv
                        advs[pos].save()

                        if (nadvs >= 2 && nadvs <= 3) {
                            usuario.timeout(300000, "Nível 1 ADV")
                        } else if (nadvs >= 4 && nadvs <= 5) {
                            usuario.timeout(30 * 60000, "Nível 2 ADV")
                        } else if (nadvs >= 6 && nadvs <= 7) {
                            usuario.timeout(24 * 60 * 60000, "Nível 3 ADV" )
                        } else if (nadvs >= 8 ){
                            usuario.ban({ reason: "Mais de 8 ADVs" })
                        }

                        for (let pos_a = 1; pos_a <= nadvs; pos_a++) {
                            embed.addFields({ name: `Adv ${pos_a}`, value: `${advs[pos].Adv[pos_a - 1]} \n \u200b ` })
                        }
                    }
                }


                // User nunca foi reportado
                if (existe === 0) {
                    adv.create({
                        UserId: userR,
                        Nadv: 1,
                        Adv: motivoc,
                    })
                    nadvs = 1

                    embed.addFields({ name: `Adv 1`, value: `${motivoc} \n \u200b` },)
                }
                embed.setDescription(`\n Membro: **${userR}** \n Número de Advertências: **${nadvs}** \n \n Motivos:`)



                interaction.editReply({ embeds: [embed] });
            } catch (err) {
                console.log(err)
            }

        }
    }
};
console.log('ADV: Carregado com sucesso');