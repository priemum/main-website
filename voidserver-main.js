//------------- DEFINITIONS
const Discord = require("discord.js");
const fs = require('fs');
const client = new Discord.Client({ fetchAllMembers: true, disableMentions: 'here', disableMentions: 'everyone' });
//------------- DEFINITIONS

//------------- CONFIG
global.config = {
  "token": "",
  "clientid": "",
  "secret": "",
  "callback": "",
  "site": "https://voiddevs.org"
}
//------------- CONFIG


//-------------Events---------------\\

require('events').EventEmitter.prototype._maxListeners = 100;

// Command Loader
client.komutlar = new Discord.Collection();
client.aliases = new Discord.Collection();  
fs.readdir("./commands/", (err, files) => {
  if (err) console.error(err);
  console.log(`${files.length} komut yüklenecek.`);
  files.forEach(f => {
   if(!f.endsWith('.js')) return 
    let props = require(`./commands/${f}`);
   if(!props.help) return
    console.log(`Yüklenen komut: { ${props.help.name} }`);
    client.komutlar.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
          global.commands = files;
    });
  });
});

// Prefix Avaible
client.on('message', async message => {
let p = "v?"
let client = message.client;
if (message.author.bot) return;
if (!message.content.startsWith(p)) return;
let command = message.content.split(" ")[0].slice(p.length);
let params = message.content.split(" ").slice(1);
let cmd
if (client.komutlar.has(command)) {
cmd = client.komutlar.get(command);
} else if (client.aliases.has(command)) {
cmd = client.komutlar.get(client.aliases.get(command));
}
if (cmd) {
}
cmd.run(client, message, params, p);
})


//------------- WEBSITE
require("./voidserver.js")(client);
//------------- WEBSITE

//------------- CLIENT
client.login(global.config.token);
client.on("ready", () => {
  client.user.setPresence({ status: "dnd" })
  client.user.setActivity("voiddevs.org", { type: "WATCHING" });
  console.log("voiddevs.org is online.");
})
//------------- CLIENT
