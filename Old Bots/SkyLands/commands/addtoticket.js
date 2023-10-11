const { ContextMenuCommandBuilder, ApplicationCommandType, EmbedBuilder, PermissionFlagsBits, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { listenerCount } = require('..');
const db = require('../DB/app')
const func = require('../src/functionsSuport/ticket')

module.exports = {
	data: new ContextMenuCommandBuilder()
		.setName('Adicionar ao ticket')
		.setType(ApplicationCommandType.User),

	async execute(interaction, client) {
		const listaChats = []
		const consultTicket = await db.consultTicket(interaction.member.guild.id, interaction.member.user.id, '*')
		for (i = 0; consultTicket.length > i; i++) {
			const chat = await func.confirmaChat(interaction, consultTicket[i].chat)
			if (chat) { listaChats.push(chat[0]) }
		}

		if (listaChats.length == 0) {
			const embed = new EmbedBuilder()
				.setColor(0x0099ff)
				.setTitle(`Sistema de Atendimento ${interaction.member.guild.name}`)
				.setDescription('Você não tem ticket para adicionar este membro!!!')
				.setTimestamp(new Date())

			interaction.reply({ embeds: [embed], ephemeral: true });
		} else if (listaChats.length == 1) {
			const target = await client.users.fetch(interaction.targetId)
			const embed = new EmbedBuilder()
				.setColor(0x0099ff)
				.setTitle(`Sistema de Atendimento ${interaction.member.guild.name}`)
				.setDescription(`Adicionando membro ${target} ao unico Ticket aberto!!! 
				Ticket: <#${listaChats[0].id}> `)
				.setTimestamp(new Date())

			const embed2 = new EmbedBuilder()
				.setColor(0x0099ff)
				.setTitle(`Sistema de Atendimento ${interaction.member.guild.name}`)
				.setDescription(`Você foi adicionado ao ticket <#${listaChats[0].id}>!!! 
				Caso não esteja de acordo, vai ao painel to ticket e clique em`+ "```Sair do ticket```")
				.setTimestamp(new Date())
				.setImage("https://i.imgur.com/lihTqU6.png")

			const channel = interaction.member.guild.channels.cache.get(listaChats[0].id)
			channel.permissionOverwrites.edit(interaction.targetId,
				{
					ViewChannel: true,
					SendMessages: true,
					AttachFiles: true
				},
			)

			target.send({ embeds: [embed2] })
			interaction.reply({ embeds: [embed], ephemeral: true });
		} else if (listaChats.length > 1) {
			const target = await client.users.fetch(interaction.targetId)
			const listaMenu = []

			for (i = 0; i < listaChats.length; i++) {

				listaMenu.push({
					label: listaChats[i].name,
					/* description: '',
					emoji: '', */
					value: listaChats[i].id + `-` + interaction.targetId,
				})
			}
			const painel = new ActionRowBuilder().addComponents(new StringSelectMenuBuilder()
				.setCustomId('addUserTicket')
				.setPlaceholder('Selecione o ticket!!!')
				.addOptions(listaMenu)
			)
			const embed = new EmbedBuilder()
				.setColor(0x0099ff)
				.setTitle(`Sistema de Atendimento ${interaction.member.guild.name}`)
				.setDescription(`Seleciona a baixo o ticket em que deseja adicionar o membro ${target}`)
				.setTimestamp(new Date())
				.setImage("https://i.imgur.com/lihTqU6.png")


			interaction.reply({ embeds: [embed], components: [painel], ephemeral: true });
		}
	}
}



console.log('Adicionar ao Ticket: Carregado com sucesso');