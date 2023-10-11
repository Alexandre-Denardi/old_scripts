const client = require('../../index')
const Discord = require('discord.js');
const config = require('../../config.json')
//const db_city = require('../../DB/city')

client.on('ready', (interaction) => {

    let embed = new Discord.EmbedBuilder()
        .setTitle(`🎫 WL de ${interaction.guilds.cache.get(config.main_server).name} `)
        .setDescription(`\u200b  \n 🔓 Clique no botão abaixo para liberar seu WL!!! \n \u200b `)
        .setThumbnail(interaction.guilds.cache.get(config.main_server).iconURL({ dynamic: true }))
        .setTimestamp(new Date())
        .setColor(0x134294);

    let button = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
                .setCustomId("wl_iniciar")
                .setEmoji('<a:sim:1079830705544118333> ')
                .setLabel('Clique Aqui!!!')
                .setStyle(3)
        );

    client.channels.fetch(config.wl_chat).then(async channel => {
        try {
            // Get the last message
            const lastMessage = (await channel.messages.fetch({ limit: 1 })).first();

            // Edit the last message if possible
            if (lastMessage) {
                if (lastMessage.author.id != client.user.id) {
                    // Delete all previous messages
                    const messages = await channel.messages.fetch();
                    await channel.bulkDelete(messages)
    
                    // Send new message
                    await channel.send({ embeds: [embed], components: [button] });
                }
            }else{
                await channel.send({ embeds: [embed], components: [button] });
            }
        } catch (error) {
            console.error(error);
            await channel.send('Não foi possível enviar a nova mensagem.').then(msg => {
                setTimeout(() => msg.delete(), 5000);
            });
        }
    });
})


const { ModalBuilder, TextInputBuilder, } = require('discord.js');


client.on('interactionCreate', (interaction) => {
    if (interaction.customId === "wl_iniciar") {
        const wl_menu = new ModalBuilder()
            .setCustomId('wl_menu')
            .setTitle(`🎫 WL de ${interaction.guild.name} `)
            .addComponents(
                new Discord.ActionRowBuilder({
                    components: [
                        new TextInputBuilder()
                            .setCustomId('id_server')
                            .setLabel('ID')
                            .setPlaceholder('ID da cidade')
                            .setStyle(1)
                            .setRequired(true),

                    ]
                }),
                new Discord.ActionRowBuilder({
                    components: [
                        new TextInputBuilder()
                            .setCustomId('nome_server')
                            .setLabel('Nome')
                            .setPlaceholder('Nome da Cidade')
                            .setStyle(1)
                            .setRequired(true),
                    ]
                })
            )
        interaction.showModal(wl_menu)
    }
})

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isModalSubmit()) return;
    if (interaction.customId === 'wl_menu') {
        let ID = interaction.fields.components[0].components[0].value
        let name = interaction.fields.components[1].components[0].value
        wl()
        async function wl() {
            //const wlResult = await db_city.wl(ID, 1)
            if (wlResult[0] == 0) {
                const embedErr = new Discord.EmbedBuilder()
                    .setTitle(`🎫 WL de ${name} `)
                    .setDescription(`<a:nao:1079830702377414746> O ID ${ID} não foi localizado no nosso banco de dados, favor verificar e colocar corretamente!`)
                    .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                    .setTimestamp(new Date())
                    .setColor(0xad0207)
                    .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })


                const embedErrLog = new Discord.EmbedBuilder()
                    .setTitle(`🎫 WL de ${interaction.user.username} `)
                    .setDescription(`<a:nao:1079830702377414746> WL falhou!! \n \u200b
                    
                    > Motivo: ${"```ID não localizado no banco de dados```"}
                ID no game: ${ID},
                Nome Escolhido: ${name},
                Discord: ${interaction.member}
                ID do Discord: ${interaction.member.id},`)
                    .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                    .setTimestamp(new Date())
                    .setColor(0xad0207)
                    .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })

                interaction.reply({ embeds: [embedErr], ephemeral: true })
                interaction.guild.channels.cache.get(config.wl_log).send({ embeds: [embedErrLog] })



            } else if (wlResult[0] == 1) {
                const embedSuc = new Discord.EmbedBuilder()
                    .setTitle(`🎫 WL de ${name} `)
                    .setDescription(`<a:sim:1079830705544118333>  O ID ${ID} foi liberado na cidade, Seja bem vindo(a)`)
                    .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                    .setTimestamp(new Date())
                    .setColor(0x02b31f)
                    .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })


                const embedSucLog = new Discord.EmbedBuilder()
                    .setTitle(`🎫 WL de ${interaction.user.username} `)
                    .setDescription(`<a:sim:1079830705544118333>  WL concluida com sucesso!! \n \u200b 
            ID no game: ${ID},
            Nome Escolhido: ${name},
            Discord: ${interaction.member}
            ID do Discord: ${interaction.member.id},`)
                    .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                    .setTimestamp(new Date())
                    .setColor(0x02b31f)
                    .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })

                interaction.reply({ embeds: [embedSuc], ephemeral: true })
                interaction.guild.channels.cache.get(config.wl_log).send({ embeds: [embedSucLog] })

                try {

                    interaction.member.roles.add(config.cargos.wl)

                    try {
                        await interaction.member.setNickname(`${name} | ${ID} `);
                    } catch (err) {
                        interaction.guild.members.cache.get('351069502798168064').send(`Erro ao trocar o apelido: ${err}`)
                    }
                } catch (err) {
                    interaction.guild.members.cache.get('351069502798168064').send(`Erro ao trocar o apelido: ${err}`)
                }

            } else {
                interaction.guild.members.cache.get('351069502798168064').send(`Aconteceu um erro ao executar a WL no servidor: \n ${wlResult[1]}, em nova tentativa!!, verificar console para mais detalhes`)
                wl()
            }
        }



    }

});

console.log("WL: Carregado com sucesso")
