const fs = require('fs');
const Discord = require('discord.js')
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

// Require the necessary discord.js classes
const {
    Client,
    GatewayIntentBits,
    Collection,
    Events
} = require('discord.js');

const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js')
const config = require('./config.json');

require('dotenv').config()
// Create a new client instance
const client = new Client({
    intents: [
        GatewayIntentBits.DirectMessages, 
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages
    ]
});


require('./DB/app')


// Loading commands from the commands folder
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const functionsFiles = fs.readdirSync('./src/functions/').filter(file => file.endsWith('.js'));
const ErrosFiles = fs.readdirSync('./src/erros').filter(file => file.endsWith('.js'));

console.log('\x1b[34m');
const commands = [];

// Creating a collection for commands in client
client.commands = new Collection();


for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
    client.commands.set(command.data.name, command);
}

// chamado todas funçoes
console.log('\x1b[34m');
console.log('Carregando Funcoes')
for (const Ffile of functionsFiles) {
    import(`./src/functions/${Ffile}`)

}


console.log('\x1b[34m');
console.log('Carregando Erros');
for (const Efile of ErrosFiles) {

    import(`./src/erros/${Efile}`)
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
            name: "Sky Lands RP",
            type: "PLAYING"
        }],
        status: 'ONLINE'
    });
});


module.exports = client;
client.login(config.token);