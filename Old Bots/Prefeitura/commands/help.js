const { InteractionResponseType } = require('discord-api-types/v9');
const { SlashCommandBuilder, SlashCommandStringOption } = require('@discordjs/builders');
const { MessageActionRow, MessageSelectMenu } = require('discord.js');
const Discord = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Duvidas em comandos'),



    async execute(interaction, client) {
        var avatar = "https://cdn.discordapp.com/avatars/613559708543877121/a163b90262bc00cd200f768565ed6dfd.webp"
        if (interaction.user.avatarURL() != null) { avatar = interaction.user.avatarURL() }

        if (interaction.member.nickname != null) { var nickname = interaction.member.nickname } else { var nickname = interaction.user.username }


        let embed_1 = new Discord.MessageEmbed()
            .setColor('RANDOM')
            .setTitle('Ajuda')
            .setAuthor({ name: nickname, iconURL: avatar })
            .setDescription(`
            **Olá, esta com dúvida sobre as minhas funcionalidades? \n
            Aqui pretendo remover todas elas!!!  **
            `)

        let painel = new MessageActionRow().addComponents(new MessageSelectMenu()
            .setCustomId('menu_help')
            .setPlaceholder('Selecione aqui a sua categoria')
            .addOptions([

                {
                    label: 'Home',
                    description: 'Página Inicial',
                    emoji: '↩',
                    value: 'home',
                },
                {
                    label: 'Comandos Gerais',
                    description: 'Desc 1',
                    emoji: '✨',
                    value: 'categoria_1',
                },
                {
                    label: 'Adimistração',
                    description: 'Comandos para administração do servidor!',
                    emoji: '💼',
                    value: 'categoria_2',
                },
                {
                    label: 'Posto de combustivel',
                    description: '🚗 Comandos de Posto 🚗',
                    emoji: '⛽',
                    value: 'categoria_3',
                },
                {
                    label: 'Categoria 4',
                    description: 'Desc 4',
                    emoji: '4️⃣',
                    value: 'categoria_4',
                },


            ])
        );

        await interaction.reply({ embeds: [embed_1], components: [painel] })

        client.on('interactionCreate', interaction => {
            if (!interaction.isSelectMenu()) return;
            let selecionado = interaction.values[0]

            if (selecionado === 'categoria_1') {
                embed_1.fields = []
                embed_1.setDescription('✨ Comandos gerais ✨ \n \n \u200b')
                embed_1.addFields(
                    { name: '🗳 Enquete', value: 'Criação de enquete no servidor' },
                    { name: '🏓 Ping', value: 'Testart o Status do Bot' },
                )
                interaction.update({ embeds: [embed_1], components: [painel] })
            };
            if (selecionado === 'categoria_2') {

                embed_1.fields = []
                embed_1.setDescription('✨ Comandos para Administração ✨ \n \n \u200b')
                embed_1.addFields({ name: '🎫 Ticket', value: 'Criar um menu de tickets no servidor.' },
                )

                interaction.update({ embeds: [embed_1], components: [painel] })
            };
            if (selecionado === 'categoria_3') {

                embed_1.fields = []
                embed_1.setDescription('**🚗 Comandos de Posto 🚗**\n \n \u200b')
                embed_1.addFields(
                    { name: '🚗 add_posto', value: '⛽ Cadastro de novo Posto\n \u200b'},
                    { name: '🚗 del_posto', value: '⛽ Remover posto cadastrado\n \u200b'},
                    { name: '✅ pagar_posto', value: '✅ Setar posto como pago\n \u200b'},
                    { name: '🎟 posto', value: '🎟 Verificar dados e status de pagamento\n \u200b'},
                    { name: '❗ reset_semana', value: '❗ Reseta o status de pagamento dos postos\n \u200b'},
                    { name: '🖥 resumo_semana', value: '🖥 Verifica o resumo de pagamentos\n \u200b'},
                )

                interaction.update({ embeds: [embed_1], components: [painel] })
            };
            if (selecionado === 'categoria_4') {

                embed_1.fields = []

                interaction.update({ embeds: [embed_1], components: [painel] })
            };
            if (selecionado === 'home') {

                embed_1.fields = []
                embed_1.setDescription(`
                **Olá, esta com dúvida sobre as minhas funcionalidades? \n
                Aqui pretendo remover todas elas!!!  **
                `)
                interaction.update({ embeds: [embed_1], components: [painel] })
            };
        });


    }
};
console.log('Help: Carregado com sucesso');