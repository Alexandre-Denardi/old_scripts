const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js')
const { MessageActionRow, MessageSelectMenu } = require('discord.js')


module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket')
        .setDescription('Setar um chat de tickets no discord.'),


    async execute(interaction, client) {
        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            interaction.reply('<a:817438220098207744:983125997736042536> Você Não tem permição para utilizar este comando!!!')
        } else {
            const embed = new Discord.MessageEmbed()
                .setColor("AQUA")
                .setTitle(`Tickets de ${interaction.guild.name}`)
                .setThumbnail(interaction.guild.iconURL())
                .setDescription('\u200b \n Seleciona o tipo de Ticket no menu a baixo \n \u200b ')
                .setFooter({ text: "Comando /ticket ", iconURL: client.user.avatarURL() })
                .setTimestamp(new Date())

            const painel = new MessageActionRow().addComponents(new MessageSelectMenu()
            .setCustomId('menu_ticket')
            .setPlaceholder('Selecione o tipo de ticket!!!')
            
            .addOptions([

                {
                    label: 'Home',
                    description: 'Recarregar painel',
                    emoji: '🔃',
                    value: 'reload',
                },
                {
                    label: 'Suporte',
                    description: 'Suporte geral com a adiministração do servidor',
                    emoji: '🤚',
                    value: 'Suporte_geral',
                },
                

            ]))

            interaction.reply({ embeds: [embed],components: [painel] })
        }

    }
};

console.log('Tickets: Carregado com sucesso');