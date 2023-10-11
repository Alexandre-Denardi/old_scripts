const client = require('../../index')
const config = require('../../config.json')

client.on('interactionCreate', (interaction) => {
    if (interaction.isButton()) {
        if (interaction.customId === "verificar") {
            interaction.member.roles.add(config.cargos.Verificar).catch(err => { console.log(err); })
            interaction.reply({ content: `Verificado`, ephemeral: true })
        }
    }
})

console.log("Verificar: Carregado com sucesso")

