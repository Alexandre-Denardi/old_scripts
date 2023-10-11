const client = require('../../index')
const config = require('../../config.json')
const Discord = require('discord.js')
const db = require("../../DB/app")
const discordTranscripts = require('discord-html-transcripts');

const { ModalBuilder, TextInputBuilder } = require('discord.js')


client.on("interactionCreate", async (interaction) => {
    if (interaction.isButton()) {

        if (interaction.customId === "admin_panel") {
            if (interaction.member.roles.cache.get('1019419714751041587') != null) {
                const embed = new Discord.EmbedBuilder()
                    .setColor(0x134294)
                    .setTitle(`Painel admin`)
                    .setDescription("Utilize o menu a baixo para dar continuidade nos assuntos do ticket")
                    .setThumbnail(interaction.guild.iconURL({ dynamic: true }))

                const buttons = new Discord.ActionRowBuilder()
                    .addComponents(
                        new Discord.ButtonBuilder()
                            .setCustomId("transcript")
                            .setLabel('Transcript')
                            .setEmoji('📜')
                            .setStyle(2),
                        new Discord.ButtonBuilder()
                            .setCustomId("sendDM")
                            .setLabel('DM mensagem')
                            .setEmoji('💬')
                            .setStyle(2),
                        new Discord.ButtonBuilder()
                            .setCustomId("rename")
                            .setLabel('Rename')
                            .setEmoji('✒️')
                            .setStyle(2),
                    )

                interaction.reply({ embeds: [embed], components: [buttons], ephemeral: true })

            } else {
                const embed = new Discord.EmbedBuilder()
                    .setColor(0x134294)
                    .setTitle(`Painel admin`)
                    .setDescription("Você não tem permissão para acessar este Painel")
                    .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                interaction.reply({ embeds: [embed], ephemeral: true })
            }




        } else if (interaction.customId === "close_ticket") {
            const chat = interaction.channelId

            db.finalizaTicket(chat)

            interaction.reply({ content: `O canal será deletado em 5 segundos`, ephemeral: true })
            setTimeout(function () {
                interaction.channel.delete()
            }, 5000)

        } else if (interaction.customId === "transcript") {
            const attachments = await discordTranscripts.createTranscript(interaction.channel)
            interaction.reply({ content: `Baixe o arquivo aqui`, files: [attachments], ephemeral: true })
        } else if (interaction.customId === "sendDM") {
            const userTicketID = await db.consultTicketDM(interaction.channelId)
            const userTicket = await client.users.fetch(userTicketID[0].member)
            const embed = new Discord.EmbedBuilder()
                .setColor(0x134294)
                .setAuthor({ name: `Sistema de Atendimento ${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                .setDescription(`Aguardamos sua resposta em: <#${interaction.channelId}> \n
            Caso não tenhamos uma resposta em até 24 horas o ticket será encerrado`)
                .setImage("https://i.imgur.com/lihTqU6.png")

            const embed2 = new Discord.EmbedBuilder()
                .setColor(0x134294)
                .setAuthor({ name: `Sistema de Atendimento ${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                .setDescription(`
            Mensagem enviada ao membro que abriu o ticket: ${userTicket}
            `)
                .setTimestamp(new Date())
            userTicket.send({ embeds: [embed] })
            interaction.reply({ embeds: [embed2] })
        } else if (interaction.customId === "rename") {
            const Modal = new ModalBuilder()
                .setCustomId(`renameTK`)
                .setTitle(`Renomear Ticket `)
                .addComponents(
                    new Discord.ActionRowBuilder({
                        components: [
                            new TextInputBuilder()
                                .setCustomId('newName')
                                .setLabel('Nome')
                                .setPlaceholder('Nome do Ticket')
                                .setStyle(1)
                                .setRequired(true),

                        ]
                    }))
            interaction.showModal(Modal)
        }
    }
})

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isModalSubmit()) return;
    if (interaction.customId === 'renameTK') {
        let name = interaction.fields.components[0].components[0].value
        tipo = await db.consultTicketDM(interaction.channelId)
        let selecionado = tipo[0].tipo
        if (selecionado == "denuncia") {
            nome = `『⛔Den』${name}`
        } else if (selecionado == "suporte") {
            nome = `『🤚Sup』${name}`
        } else if (selecionado == "loja_vip") {
            nome = `『🛒buy』${name}`
        } else if (selecionado == "bug") {
            nome = `『🔎Bug』${name}`
        } else if (selecionado == "rp_crianca") {
            nome = `『🧒kid』${name}`
        }
        console.log(nome)
        await interaction.channel.setName(nome)
    }
})



console.log("Tickets Painel: Carregado com sucesso")