const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js')
const { MessageActionRow, MessageSelectMenu } = require('discord.js')


module.exports = {
    data: new SlashCommandBuilder()
        .setName('jogos')
        .setDescription('Escolha o jogo que deseja ter permissão!!'),
    async execute(interaction, client) {
        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            interaction.reply({content: '<a:817438220098207744:983125997736042536> Você **Não** tem permição para utilizar este comando!!!', ephemeral: true })
        } else {
            if (interaction.guildId == 243961842165088266) {
                const embed = new Discord.MessageEmbed()
                    .setColor('RANDOM')
                    .setTitle(`Jogos de ${interaction.guild.name}`)
                    .setThumbnail(interaction.guild.iconURL())
                    .setDescription('\u200b \n Seleciona o jogo no menu a baixo \n \u200b ')
                    .setTimestamp(new Date())

                const painel = new MessageActionRow().addComponents(new MessageSelectMenu()
                    .setCustomId('menu_jogo')
                    .setPlaceholder('Selecione o Jogo!!!')
                    .setMinValues(1)
                    .setMaxValues(3)

                    .addOptions(
                        {
                            label: 'Overwatch',
                            description: 'Jogo morto, que todos tem mas o Breno não gosta',
                            emoji: '<:Overwatch:999460848714137761>',
                            value: 'overzinho',
                        },
                        {
                            label: 'Life is Feudal',
                            description: 'Jogo bosta, medieval, falido e que ninguém joga mas eu gosto',
                            emoji: '<:Lif:999468372318244924>',
                            value: 'lif',
                        },
                        {
                            label: 'Valorant',
                            description: 'Overwatch + CS-GO, so que deu ruim.',
                            emoji: '<:Valorant:999469473083965522>',
                            value: 'valval',
                        },
                    )
                    
                )
                let fechar = new Discord.MessageActionRow()
                .addComponents(
                    new Discord.MessageButton()
                        .setCustomId("remover_cargos")
                        .setLabel('Remover cargos')
                        .setStyle('DANGER')
                )

                interaction.reply({ embeds: [embed], components: [painel,fechar] })
            } else {
                interaction.reply({content: '<a:817438220098207744:983125997736042536> Você **Não** esta em um servidor permitido para executar o comando!!!', ephemeral: true })
            }

        }
    }
};

console.log('Jogos: Carregado com sucesso');