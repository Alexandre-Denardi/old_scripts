const client = require('../../index')
const config = require('../../config.json')
const Discord = require('discord.js')
const db = require("../../DB/app")
const { ActionRowBuilder, StringSelectMenuBuilder, ChannelType, PermissionFlagsBits, EmbedBuilder } = require('discord.js')

client.on('ready', (interaction) => {

    const embed = new Discord.EmbedBuilder()
        .setColor(0x134294)
        .setTitle(`Tickets de  ${interaction.guilds.cache.get(config.main_server).name}`)
        .setDescription("\u200b\n > **Informações:** \n Quando abrir um ticket, por favor, tenha em mente tudo o que precisa ser informado para nossa equipe. Isso permitirá que o processo de resolução do problema seja mais rápido e eficiente.  \n \n Para abrir um ticket, clique no menu Selecione Uma Categoria e escolha a categoria que melhor atenda suas necessidades. \n \n NÃO ABRA tickets caso não seja realmente necessário, nossa equipe de atendimento preza pela nossa comunidade e deseja fornecer a melhor experiência possível.")
        .setImage("https://i.imgur.com/lihTqU6.png")
        .setThumbnail(interaction.guilds.cache.get(config.main_server).iconURL({ dynamic: true }))
        .setTimestamp(new Date())

    const painel = new ActionRowBuilder().addComponents(new StringSelectMenuBuilder()
        .setCustomId('menu_ticket')
        .setPlaceholder('Selecione o tipo de ticket!!!')
        .addOptions([
            {
                label: 'Corregedoria',
                description: 'Corregedoria geral',
                emoji: '⛔',
                value: 'corregedoria',
            },
        ]))


    client.channels.fetch(config.ticket).then(async channel => {
        try {
            // Get the last message
            const lastMessage = (await channel.messages.fetch({ limit: 1 })).first();

            // Edit the last message if possible
            if (lastMessage != null) {
                if (lastMessage.author.id != client.user.id) {
                    // Delete all previous messages
                    const messages = await channel.messages.fetch();
                    await channel.bulkDelete(messages)

                    // Send new message
                    await channel.send({ embeds: [embed], components: [painel] });
                }
            } else {
                await channel.send({ embeds: [embed], components: [painel] });
            }
        } catch (error) {
            console.error(error);
            await channel.send('Não foi possível enviar a nova mensagem.').then(msg => {
                setTimeout(() => msg.delete(), 5000);
            });
        }
    });
})

client.on("interactionCreate", async (interaction) => {
    if (interaction.isStringSelectMenu()) {
        if (interaction.customId == "menu_ticket") {
            let selecionado = interaction.values[0]
            if (selecionado == "corregedoria") {

                createTicket(interaction, "『⛔Corr』", "corregedoria")

            } else if (selecionado == "suporte") {

                createTicket(interaction, "『🤚Sup』", "suporte")

            } else if (selecionado == "loja_vip") {

                createTicket(interaction, "『🛒buy』", "loja_vip")

            } else if (selecionado == "bug") {

                createTicket(interaction, "『🔎Bug』", "bug")

            } else if (selecionado == "rp_crianca") {

                createTicket(interaction, "『🧒kid』", "rp_crianca")
            }
        }else if(interaction.customId == 'addUserTicket') {
            let selecionado = interaction.values[0]
            let lista = selecionado.split(`-`) 
            
			const target = await client.users.fetch(lista[1])
			const embed = new EmbedBuilder()
				.setColor(0x0099ff)
				.setTitle(`Sistema de Atendimento ${interaction.member.guild.name}`)
				.setDescription(`Adicionando membro ${target} ao unico Ticket aberto!!! 
				Ticket: <#${lista[0]}> `)
				.setTimestamp(new Date())

			const embed2 = new EmbedBuilder()
				.setColor(0x0099ff)
				.setTitle(`Sistema de Atendimento ${interaction.member.guild.name}`)
				.setDescription(`Você foi adicionado ao ticket <#${lista[0]}>!!! 
				Caso não esteja de acordo, vai ao painel to ticket e clique em`+ "```Sair do ticket```")
				.setTimestamp(new Date())
				.setImage("https://i.imgur.com/lihTqU6.png")

			const channel = interaction.member.guild.channels.cache.get(lista[0])
			channel.permissionOverwrites.edit(lista[1],
                {
					ViewChannel: true,
					SendMessages: true,
					AttachFiles: true
				},
			)
                target.send({ embeds: [embed2] })
			interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
})

// Tudo que acontece após criar o ticket ]
async function ticket_main(id) {
    const embed_ticket = new Discord.EmbedBuilder()
        .setTitle(`Sistema exclusivo de Tickets ${id.guild.name}`)
        .setDescription(`Bem vindo ao sistema exclusivo de tickets de ${id.guild.name}, \n \n Estamos preparado para lhe auxiliar a qualquer tipo de problema, pedimos que envie os dados para o atendimento no chat e um staff irá lhe atender na sequência. A qualquer necessidade pode ser utilizado o menu abaixo. `)
    const button = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
                .setCustomId("admin_panel")
                .setLabel('Painel Admin')
                .setEmoji('⚙️')
                .setStyle(2),
            new Discord.ButtonBuilder()
                .setCustomId("close_ticket")
                .setLabel('Encerrar Ticket')
                .setEmoji('✖️')
                .setStyle(4),
        )
    await id.send({ embeds: [embed_ticket], components: [button] });
}

async function createTicket(interaction, name, tipo) {
    // Crinado ticket 
    const constTicket = await db.consultTicket(interaction.guildId, interaction.member.id, tipo)
    if (constTicket.length == 0) {
        interaction.guild.channels.create({
            name: `${name} ${interaction.member.displayName}`,
            type: ChannelType.GuildText,
            parent: config.cat_tickt, //Categoria

            permissionOverwrites: [
                {
                    id: interaction.guild.id,
                    deny: [PermissionFlagsBits.ViewChannel]
                },
                {
                    id: interaction.user.id,
                    allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.AttachFiles]
                },
                {
                    id: config.staff_id,
                    allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.AttachFiles, PermissionFlagsBits.UseApplicationCommands]
                },
            ]
        }).then(async c => {
            const guild = interaction.guildId
            const membro = interaction.member.id
            const chat = c.id
            await db.createTicket(guild, membro, tipo, chat)
            await ticket_main(c)
            interaction.reply({ content: `Ticket aberto em - <#${chat}>`, ephemeral: true })
        })
    } else {
        const chat = await constTicket[0].chat
        if (interaction.guild.channels.cache.get(chat) != null) {
            interaction.reply({ content: `Ticket já aberto em - <#${chat}>`, ephemeral: true })
        } else {
            await db.finalizaTicket(chat)
            await createTicket(interaction, name, tipo)
        }

    }
}
