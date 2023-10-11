const { SlashCommandBuilder, SlashCommandStringOption } = require('@discordjs/builders');
const { MessageEmbed, Client } = require('discord.js');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('enquete')
        .setDescription('Criar uma votação')
        .addStringOption(option => option
            .setName('pergunta')
            .setDescription('Descreva o tipo de votção que pretende criar')
            .setRequired(true))
        .addStringOption(positivo => positivo
            .setName('positivo')
            .setDescription('Opção para resposta positiva (Padrão: Sim)'))
        .addStringOption(negativo => negativo
            .setName('negativo')
            .setDescription('Opção para resposta negativa (Padrão: Não)')),

    async execute(interaction, client) {
        const input = interaction.options.getString("pergunta")
        const user = interaction.options.getUser('user');

        const embed = new MessageEmbed()
            .setColor('0x00FFFF')
            .setTitle(interaction.guild.name)
            .setDescription(`**🗳 ${input}**`)
            .setFooter({ text: "Comando /enquete ", iconURL: client.user.avatarURL() })


        try {
            const positivo = interaction.options.getString("positivo")
            if (positivo != null) {
                embed.addField('\u200b', `<a:SIM:1005889522900422726>  ${positivo}`)
            }
        } catch (error) {
            //pass
        }
        try {
            const negativo = interaction.options.getString("negativo")

            if (negativo != null) {
                embed.addField('\u200b', `<a:NAO:1005889521063305368> ${negativo}`)
            }
        } catch (error) {
            //pass
        }


        await interaction.reply({ embeds: [embed] });
        const message = await interaction.fetchReply();
        await message.react('<a:SIM:1005889522900422726>');
        await message.react('<a:NAO:1005889521063305368>');
    }
};
console.log('Enquete: Carregado com sucesso');