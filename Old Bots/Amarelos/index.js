const fs = require('fs');
const Discord = require('discord.js')
const {
    REST
} = require('@discordjs/rest');
const {
    Routes, InteractionType
} = require('discord-api-types/v9');
// Require the necessary discord.js classes
const {
    Client,
    Intents,
    Collection
} = require('discord.js');

const { MessageActionRow, MessageSelectMenu } = require('discord.js')
const config = require('./config.json');
const Database = require('./config/database');
const db = new Database;

db.connect();

require('dotenv').config()

// Create a new client instance
const client = new Client({
    intents: [Intents.FLAGS.GUILDS]
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
                    case 'overzinho':
                        interaction.member.roles.add("807334195721797652").catch(err => { console.log(err); })
                        break;

                    case 'lif':
                        interaction.member.roles.add("752061449609805917").catch(err => { console.log(err); })
                        break;

                    case 'valval':
                        interaction.member.roles.add("999468851949486160").catch(err => { console.log(err); })
                        break;
                }
            }
            interaction.reply({ content: `Cargos adicionados`, ephemeral: true })
        }
    } else if (interaction.isButton()) {
        if (interaction.customId === "remover_cargos") {
            interaction.member.roles.remove("807334195721797652").catch(err => { console.log(err); })
            interaction.member.roles.remove("752061449609805917").catch(err => { console.log(err); })
            interaction.member.roles.remove("999468851949486160").catch(err => { console.log(err); })

            interaction.reply({ content: `Cargos removidos!!!`, ephemeral: true })
        }
    }
})

client.on('interactionCreate', (interaction) => {
    if (interaction.isButton()) {
        if (interaction.customId === "verificar") {
            interaction.member.roles.add("1004538719296032871").catch(err => { console.log(err); })
            interaction.reply({ content: `Verificado`, ephemeral: true })
        }
    }
})

//Meta painel
const { Modal, TextInputComponent } = require('discord.js');
const meta = require('./models/meta')
client.on('interactionCreate', (interaction) => {
    if (interaction.customId === "metaButton") {
        const metaMenu = new Modal()
            .setCustomId('metaPainel')
            .setTitle('Metas')
            .addComponents(
                new MessageActionRow({
                    components: [
                        new TextInputComponent()
                            .setCustomId('dinheiroSinput')
                            .setLabel('Quanto dinheiro entrou para a fac?')
                            .setPlaceholder('Somente o número')
                            .setStyle('SHORT')
                            .setRequired(true)
                    ]
                })
            )
        interaction.showModal(metaMenu)
    }
})
//enviando os dados da meta para o Banco de Dados
client.on('interactionCreate', async (interaction) => {
    if (interaction.type === 'MODAL_SUBMIT') {
        if (interaction.customId === 'metaPainel') {
            await interaction.reply({ content: 'Cadastrando dados no banco.', ephemeral: true });
            const dinheiroSinput = interaction.fields.components[0].components[0].value
            const dcID = interaction.user.id
            await meta.create({
                id: dcID,
                dinhieiroS: dinheiroSinput,
            })
            
            await interaction.editReply({ content: 'Valor cadastrado no banco de dados.', ephemeral: true });
        }
    }
});




module.exports = client;
client.login(config.token);

