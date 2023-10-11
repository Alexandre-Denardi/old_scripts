const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const db = require('../DB/app.js')


module.exports = {
    data: new SlashCommandBuilder()
        .setName('tempocall')
        .setDescription('Este comando irá buscar o seu tempo em call dentro deste servidor')
        .addUserOption(Option => Option
            .setName('membro')
            .setDescription('Mencione aqui um membro caso queira ver o tempo dele.'))
            .setDMPermission(false),
    async execute(interaction, client) {


        const ServerID = interaction.guildId
        let UserID = ""
        if (interaction.options.getUser('membro') == null) {
            UserID = interaction.user.id
        } else {
            UserID = interaction.options.getUser('membro').id
        }

        const list = await db.ConsultUserCallTime(ServerID, UserID)

        let totalDiferencaMilisegundos = 0;
        for (var i = 0; i < list.length; i++) {

            const henter = new Date(list[i].DEnter);
            const hexit = new Date(list[i].DExit);

            if (list[i].DExit != null && list[i].DEnter != null) {
                const diffInMilliseconds = hexit - henter;
                totalDiferencaMilisegundos += diffInMilliseconds
                if (i == 0) {
                    startDate = henter.getDate()
                    startMonth = henter.getMonth()
                    startYear = henter.getFullYear()
                }

                lastDate = henter.getDate()
                lastMonth = henter.getMonth()
                lastYear = henter.getFullYear()
            }
        }


        const diffInSeconds = totalDiferencaMilisegundos / 1000;

        const days = Math.floor(diffInSeconds / 86400);
        const remainingSeconds = diffInSeconds % 86400;

        const hours = Math.floor(remainingSeconds / 3600);
        const minutes = Math.floor((remainingSeconds % 3600) / 60);
        const seconds = Math.floor(remainingSeconds % 60);

        let formattedTime = '';

        if (days > 0) {
            if (days == 1) {
                formattedTime += days + ' dia ';
            } else {
                formattedTime += days + ' dias ';
            }
        }

        formattedTime +=
            hours.toString().padStart(2, '0') + ':' +
            minutes.toString().padStart(2, '0') + ':' +
            seconds.toString().padStart(2, '0');
            
        const embed = new Discord.EmbedBuilder()
            .setColor(0x134294)
            .setTitle(`Tempo em call `)
            .setThumbnail(interaction.guild.members.cache.get(UserID).displayAvatarURL({ dynamic: true }))
            .setTimestamp(new Date())

        if (list.length == 0) {
            embed.setDescription(`o membro <@${UserID}> não entrou em call no periodo de verificação`)
        } else {
            embed.setDescription(`Verificando <@${UserID}> \n\n **Tempo em call entre os dias:** \n ${startDate}/${startMonth}/${startYear} até ${lastDate}/${lastMonth}/${lastYear} \n \n **Tempo total em call:**\n ${formattedTime}`)
        }
        interaction.reply({ embeds: [embed] })
    }
};

console.log('mytime: Carregado com sucesso');