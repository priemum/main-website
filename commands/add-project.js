const Discord = require('discord.js')
const Database = require("void.db");
const db = new Database("./databases/projects.json");
let owners = ["524213944043438098","714451348212678658"]
module.exports.run = async (client,message,args) => { 
if(!owners.includes(message.author.id)) return message.reply("access denied.");
message.channel.send(`Bir proje adı belirtiniz.`).then(msg => {
message.channel.awaitMessages(m => m.author.id == message.author.id, {max: 1, time: 30000}).then(projectName => {

  
if(projectName.first().content) {
projectName.first().delete({timeout: 1000})

}
  
msg.edit(`**${projectName.first().content}** için bir açıklama girin.`)
  
message.channel.awaitMessages(m => m.author.id == message.author.id, {max: 1, time: 30000}).then(projectDesc => {
  
  
if(projectDesc.first().content) {
projectDesc.first().delete({timeout: 1000})
}
  
msg.edit(`**${projectName.first().content}** için bir ziyaret bağlantısı girin. (https://domain.com)`)
  
message.channel.awaitMessages(m => m.author.id == message.author.id, {max: 1, time: 30000}).then(siteUrl => {
  
if(siteUrl.first().content) {
siteUrl.first().delete({timeout: 1000})
}
  
msg.edit(`**${projectName.first().content}** için bir resim url'si belirtiniz.`)
  
message.channel.awaitMessages(m => m.author.id == message.author.id, {max: 1, time: 30000}).then(projectImage => {
  
if(projectImage.first().content) {
projectImage.first().delete({timeout: 1000})
}
  
msg.edit(`Site içi gözükücek bir renk kodu belirtiniz. (# olmadan)`) 
  
message.channel.awaitMessages(m => m.author.id == message.author.id, {max: 1, time: 30000}).then(hexColor => {
  
if(hexColor.first().content) {
hexColor.first().delete({timeout: 1000})
}
  
msg.edit(`**${projectName.first().content}** projesi başarıyla eklendi.`)   
  
db.push(`projects`, { name: projectName.first().content, description: projectDesc.first().content, visiturl: siteUrl.first().content, imageurl: projectImage.first().content, hexColor: hexColor.first().content })
})
})
})
})
})
})
};
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
};
  
exports.help = {
  name: "add-project",
  description: "",
  usage: ""
};
