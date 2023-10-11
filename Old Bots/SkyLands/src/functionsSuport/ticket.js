const db = require('../../DB/app')
const client = require('../../index')


async function confirmaChat(interaction, chatID) {

    const channel = interaction.member.guild.channels.cache.get(chatID)
     if (channel != null) {
        let valor = {id: chatID, name: channel.name}
        lista = [valor]
        return lista
}else{
    await db.finalizaTicket(chatID)
  
}} 

 
module.exports = {confirmaChat};