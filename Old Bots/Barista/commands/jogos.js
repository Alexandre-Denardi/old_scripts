const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js')
const { MessageActionRow, MessageSelectMenu } = require('discord.js')


module.exports = {
    data: new SlashCommandBuilder()
        .setName('jogos')
        .setDescription('Escolha o jogo que deseja ter permissão!!'),
    async execute(interaction, client) {
        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            interaction.reply({content: '<a:nao:1021557971437760603>  Você **Não** tem permição para utilizar este comando!!!', ephemeral: true })
        } else {
            if (interaction.guildId == 977590847103184896) {
                const embed = new Discord.MessageEmbed()
                    .setColor('0xC3B8F9')
                    .setTitle(`Jogos de ${interaction.guild.name}`)
                    .setThumbnail(interaction.guild.iconURL())
                    .setDescription('\u200b \n Seleciona o jogo no menu a baixo \n \u200b ')
                    .setTimestamp(new Date())

                const painel = new MessageActionRow().addComponents(new MessageSelectMenu()
                    .setCustomId('menu_jogo')
                    .setPlaceholder('Selecione o Jogo!!!')
                    .setMinValues(1)
                    .setMaxValues(6)

                    .addOptions(
                        {
                            label: 'Valorant',
                            description: '',
                            emoji: '<:valorant:1021556937604739092>',
                            value: 'valval',
                        },
                        {
                            label: 'League of Legends',
                            description: '',
                            emoji: '<:lol:1021557406238507060>',
                            value: 'lol',
                        },
                        {
                            label: 'Tower of Fantasy',
                            description: '',
                            emoji: '<:tof:1021561659891929109>',
                            value: 'tof',
                        },
                        {
                            label: 'Minecraft',
                            description: '',
                            emoji: '<:mine:1021556933645312060>',
                            value: 'minecraft',
                        },
                        {
                            label: 'GTA RP',
                            description: '',
                            emoji: '<:FIVEM:1021560078526062633>',
                            value: 'fivem',
                        },
                        {
                            label: 'Meridian',
                            description: '',
                            emoji: '<:TDO_pinkheartt:1005910790064312460>',
                            value: '3dxchat',
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

                const channel = client.channels.cache.get(interaction.channelId);
                channel.send({ embeds: [embed], components: [painel,fechar] });
                interaction.reply("\u200b")
                interaction.deleteReply()

            } else {
                interaction.reply({content: '<a:nao:1021557971437760603>  Você **Não** esta em um servidor permitido para executar o comando!!!', ephemeral: true })
            }

        }
    }
};

console.log('Jogos: Carregado com sucesso');""