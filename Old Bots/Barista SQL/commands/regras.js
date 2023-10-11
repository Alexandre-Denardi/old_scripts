const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('regras')
        .setDescription('Regras do servidor'),
    async execute(interaction, client) {

        const embed = new Discord.MessageEmbed()
            .setColor('0xC3B8F9')
            .setTitle('Regras do servidor')
            .setDescription('<a:0magentaverification:1004838083046412338> | Assim que chegar em nosso servidor, pegue seu <#1021215329701089424>  e seus <#1004835423580852317> para ter acesso aos canais de membro do servidor. \n \n <:TDO_pinkheartt:1005910790064312460> | Proibido perseguir, assediar ou ameaça membros do server; \n <:TDO_pinkheartt:1005910790064312460> | Proibido quaisquer tipos de ofensas, seja falada ou digitada. De qualquer natureza: insulto, apologia ou discriminação; \n <:TDO_pinkheartt:1005910790064312460> | É proibida a divulgação, seja no privado dos membros ou em call e chats do servidor; \n <:TDO_pinkheartt:1005910790064312460> | Marcações excessiva de cargos ou membros; \n <:TDO_pinkheartt:1005910790064312460> | Conteúdo contendo pedofilia, morte, susto, zoofilia ou qualquer coisa pesada; \n <:TDO_pinkheartt:1005910790064312460> | É proibido poluir nossos chats com spam, flood ou raid;\n <:TDO_pinkheartt:1005910790064312460> | Proibida qualquer postagem de imagens ou links de finalidade racista, pornográfica (porém depende), homofóbica, incitação à violência e à pedofilia; \n <:TDO_pinkheartt:1005910790064312460> | Proibido executar comandos no chat geral, correndo risco de ser mutado ou banido. ')

        const channel = client.channels.cache.get(interaction.channelId);
        channel.send({embeds: [embed]});
        interaction.reply("\u200b")
        interaction.deleteReply()
    }
};

console.log('Regras: Carregado com sucesso');