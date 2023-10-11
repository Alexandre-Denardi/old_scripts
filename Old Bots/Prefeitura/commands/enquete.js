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
                embed.addField('\u200b', `<a:817438197524201505:983125995064295486>  ${positivo}`)
            }
        } catch (error) {
            //pass
        }
        try {
            const negativo = interaction.options.getString("negativo")

            if (negativo != null) {
                embed.addField('\u200b', `<a:817438220098207744:983125997736042536> ${negativo}`)
            }
        } catch (error) {
            //pass
        }


        await interaction.reply({ embeds: [embed] });
        const message = await interaction.fetchReply();
        await message.react('<a:817438197524201505:983125995064295486>');
        await message.react('<a:817438220098207744:983125997736042536>');
    }
};
console.log('Enquete: Carregado com sucesso');