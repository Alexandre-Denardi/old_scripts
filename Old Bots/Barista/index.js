const fs = require('fs');
const Discord = require('discord.js')
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

// Require the necessary discord.js classes
const {
    Client,
    Intents,
    Collection
} = require('discord.js');

const { MessageActionRow, MessageSelectMenu } = require('discord.js')
const config = require('./config.json');

require('dotenv').config()

// Banco de dados
const Database = require('./config/database');
const db = new Database;

db.connect();

// Create a new client instance
const client = new Client({
    intents: [Intents.FLAGS.GUILDS],
    intents: 32767,
});

// Loading commands from the commands folder
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

console.log('\x1b[34m');
const commands = [];

// Creating a collection for commands in client
client.commands = new Collection();

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
    client.commands.set(command.data.name, command);
}


// When the client is ready, this only runs once
client.once('ready', () => {
    // Registering the commands in the client
    const CLIENT_ID = client.user.id;
    const rest = new REST({
        version: '9'
    }).setToken(config.token);
    (async () => {
        try {

            await rest.put(
                Routes.applicationCommands(CLIENT_ID), {
                body: commands
            },
            );
            console.log('')
            console.log('\x1b[33m', 'Comandos globais carregados');
            console.log('')
            console.log('\x1b[32m', `O bot: ${client.user.username} foi carregado com sucesso. `)
            console.log('\x1b[0m')

        } catch (error) {
            if (error) console.error('\x1b[31m', error);
        }
    })();
});


client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    try {
        await command.execute(interaction, client);
    } catch (error) {
        if (error) console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

// Setar a presensa do BOT
client.on("ready", () => {
    client.user.setPresence({
        activities: [{
            name: 'vodka na sua boca!!!',
            type: "PLAYING"
        }],
        status: 'ONLINE'
    });
});

// COMANDOS

client.on('interactionCreate', (interaction) => {
    if (interaction.isSelectMenu()) {
        if (interaction.customId === "menu_ticket") {
            let selecionado = interaction.values[0]
            if (selecionado === 'Suporte_geral') {
                if (interaction.guild.channels.cache.has(c => c.name === `🎫 - ${interaction.user.id}`)) {
                    let c = interaction.guild.channels.cache.find(c => c.name === `🎫 - ${interaction.user.id}`)
                    interaction.reply(`Você já possui um ticket aberto em ${c}`)
                } else {
                    interaction.guild.channels.create(`🎫 - ${interaction.user.id}`, {
                        type: "GUILD.TEXT",
                        //parent: "" //Categoria
                        permissionOverwrites: [
                            {
                                id: interaction.guild.id,
                                deny: ["VIEW_CHANNEL"]
                            },
                            {
                                id: interaction.user.id,
                                allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "ATTACH_FILES"]
                            },
                        ]
                    }).then(c => {

                        interaction.reply({ content: `Olá, seu ticket foi aberto em ${c}.`, ephemeral: true })

                        let embed = new Discord.MessageEmbed()
                            .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                            .setDescription(`Olá, este é o seu chat de Suporte, descreva o seu problema e logo a equipe lhe atenderá! \n \n Caso necessário pode encerrar o ticket no botão a baixo.`)

                        let fechar = new Discord.MessageActionRow()
                            .addComponents(
                                new Discord.MessageButton()
                                    .setCustomId("ticket_fechar")
                                    .setEmoji('<a:817438220098207744:983125997736042536>')
                                    .setStyle("SECONDARY")
                            );

                        c.send({ embeds: [embed], components: [fechar] }).then(msg => msg.pin())
                    })
                }
            } else if (selecionado === 'reload') {
                const painel = new MessageActionRow().addComponents(new MessageSelectMenu()
                    .setCustomId('menu_ticket')
                    .setPlaceholder('Selecione o tipo de ticket!!!')

                    .addOptions([

                        {
                            label: 'Home',
                            description: 'Recarregar painel',
                            emoji: '🔃',
                            value: 'reload',
                        },
                        {
                            label: 'Suporte',
                            description: 'Suporte geral com a adiministração do servidor',
                            emoji: '🤚',
                            value: 'Suporte_geral',
                        },


                    ]))
                interaction.update({ components: [painel] })
            }

        }
    } else if (interaction.isButton()) {
        if (interaction.customId === "ticket_fechar") {
            interaction.reply(`<a:817438220098207744:983125997736042536> Suporte finalizado, este ticket será fechado em \`5 segundos\`...`).then(() => {
                setTimeout(() => {
                    interaction.channel.delete()
                }, 5000)
            })
        }
    }

})

client.on('interactionCreate', (interaction) => {
    if (interaction.isSelectMenu()) {
        if (interaction.customId === "menu_jogo") {
            let selecionado_game = interaction.values
            for (var i = 0; i < selecionado_game.length; i++) {
                var game = interaction.values[i]
                switch (game) {
                    case 'valval':
                        interaction.member.roles.add("1021554020390801440").catch(err => { console.log(err); })
                        break;

                    case 'lol':
                        interaction.member.roles.add("1021554081015283743").catch(err => { console.log(err); })
                        break;

                    case 'tof':
                        interaction.member.roles.add("1021554132605210655").catch(err => { console.log(err); })
                        break;

                    case 'minecraft':
                        interaction.member.roles.add("1021554180730658897").catch(err => { console.log(err); })
                        break;

                    case 'fivem':
                        interaction.member.roles.add("1021554223265103873").catch(err => { console.log(err); })
                        break;

                    case '3dxchat':
                        interaction.member.roles.add("1022312073742524446").catch(err => { console.log(err); })
                        break;
                }
            }
            interaction.reply({ content: `Cargos adicionados`, ephemeral: true })
        }
    } else if (interaction.isButton()) {
        if (interaction.customId === "remover_cargos") {
            interaction.member.roles.remove("1021554020390801440").catch(err => { console.log(err); })
            interaction.member.roles.remove("1021554081015283743").catch(err => { console.log(err); })
            interaction.member.roles.remove("1021554132605210655").catch(err => { console.log(err); })
            interaction.member.roles.remove("1021554180730658897").catch(err => { console.log(err); })
            interaction.member.roles.remove("1021554223265103873").catch(err => { console.log(err); })
            interaction.member.roles.remove("1022312073742524446").catch(err => { console.log(err); })

            interaction.reply({ content: `Cargos removidos!!!`, ephemeral: true })
        }
    }
})

client.on('interactionCreate', (interaction) => {
    if (interaction.isButton()) {
        if (interaction.customId === "verificar") {
            interaction.member.roles.add(config.verificar).catch(err => { console.log(err); })
            interaction.reply({ content: `Verificado`, ephemeral: true })
        }
    }
})

// Membro entrou no Discord

client.on("guildMemberAdd", async (member) => {
    let embed_newMember = new Discord.MessageEmbed()

        .setDescription(` 🚪 Novo membro entrou no serivdor  🚪  \n \n ${member} \n ${member.user.id}`)
        .setColor('0xC3B8F9')
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))

    member.guild.channels.cache.get('977590847837204562').send({ embeds: [embed_newMember] })

})

client.on("guildMemberRemove", async (member) => {
    let embed_newMember = new Discord.MessageEmbed()

        .setDescription(` 🗑 Um corno(a) saiu do serivdor 🗑 \n \n ${member} \n ${member.user.id}`)
        .setColor('RED')
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))

    member.guild.channels.cache.get('977590847837204562').send({ embeds: [embed_newMember] })

})


// Log canais de Voz 

client.on("voiceStateUpdate", async (oldMember, newMember) => {


    let oldVoice = oldMember.channelId;
    let newVoice = newMember.channelId;
    let ID = oldMember.id
    let usuario = newMember.guild.members.cache.get(ID)


    if (oldVoice == null) {
        let embed = new Discord.MessageEmbed()
            .setTitle('Entrou em canal de voz')
            .setDescription(`O bebado <@${ID}> entrou no canal de voz <#${newVoice}>.`)
            .setThumbnail(usuario.displayAvatarURL({ dynamic: true }))
            .setTimestamp(new Date())
            .setColor("GREEN")

        oldMember.guild.channels.cache.get(config.logCall).send({ embeds: [embed] })


    } else if (oldVoice != null && newVoice != null && oldVoice != newVoice) {
        let embed = new Discord.MessageEmbed()
            .setTitle('Trocou em canal de voz')
            .setDescription(`O bebado <@${ID}> \n Saiu de <#${oldVoice}> \n Entrou no canal de voz  <#${newVoice}>. \n \u200b`)
            .setThumbnail(usuario.displayAvatarURL({ dynamic: true }))
            .setTimestamp(new Date())
            .setColor('0xC3B8F9')

        oldMember.guild.channels.cache.get(config.logCall).send({ embeds: [embed] })

    } else if (oldVoice != null && newVoice == null) {
        let embed = new Discord.MessageEmbed()
            .setTitle('Saiu dos canais de voz')
            .setDescription(`O bebado <@${ID}> saiu do canal de voz <#${oldVoice}> e não voltou mais.`)
            .setThumbnail(usuario.displayAvatarURL({ dynamic: true }))
            .setTimestamp(new Date())
            .setColor('RED')

        oldMember.guild.channels.cache.get(config.logCall).send({ embeds: [embed] })
    }
})

// mensagens 

client.on("messageDelete", async (message) => {

    if (config.msgLog == null) return;
    if (message.author.bot) return;

    let user = message.author;
    let channelID = message.channel;
    let msgDelete = message.content;

    let embed = new Discord.MessageEmbed()
        .setTitle('Mensagem Excluída')
        .setColor('RED')
        .setTimestamp(new Date())
        .addFields(
            {
                name: 'Autor da mensagem: ',
                value: `${user}`,
                inline: true,
            },
            {
                name: 'De que canal foi apagado:',
                value: `${channelID}`,
                inline: true,
            }

        )
        .setFooter({ text: `${message.guild.name}`, iconURL: message.guild.iconURL({ dynamic: true }) })
        .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
    if (msgDelete != '') {
        embed.addFields(
            {
                name: 'Mensagem:',
                value: `${msgDelete}`,
            })
    }
    if (message.attachments.size >= 1) {
        var loc = 1
        for (var i = 0; i < message.attachments.size; i++) {
            embed.addFields({
                name: `Arquivo ${loc}:`,
                value: `${message.attachments.map(a => a.url)[i]}`
            })
            loc++
        }
    }

    message.guild.channels.cache.get(config.msgLog).send({ embeds: [embed] })
})


// Editar msg

client.on("messageUpdate", async (message, oldMessage) => {

    if (config.msgLog == null) return;

    if (message.author.bot) return;

    let user = message.author
    let channelID = message.channel;
    let msgOld = message.content;
    let msgNew = oldMessage.content;

    if (msgNew != msgOld) {
        let embed = new Discord.MessageEmbed()
            .setTitle('Mensagem Editada')
            .setColor('0xC3B8F9')
            .setTimestamp(new Date())
            .addFields(
                {
                    name: 'Autor da mensagem: ',
                    value: `${user}`,
                    inline: true,
                },
                {
                    name: 'De que canal foi editada:',
                    value: `${channelID}`,
                    inline: true,
                },
                {
                    name: 'Mensagem antiga:',
                    value: `${msgOld}`
                },
                {
                    name: 'Nova mensagem:',
                    value: `${msgNew}`
                }
            )
            .setFooter({ text: `${message.guild.name}`, iconURL: message.guild.iconURL({ dynamic: true }) })
            .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))


        message.guild.channels.cache.get(config.msgLog).send({ embeds: [embed] })
    }

})

/* client.on('ready', () => {
    console.log("entrou")

    const express = require('express');

    const botDetails = {
        guilds: client.guilds.cache.size,
        users: client.users.cache.size,
        channels: client.channels.cache.size,
    }

    const app = express();

    const port = 8080;

    app.get("/", (req,res) => {
        res.status(200).send('Página Principal')
    })

    app.get("/info", (req, res) => {
        res.status(200).send(botDetails)
    }) 

    app.listen(port)
}) */



module.exports = client;
client.login(config.token);

