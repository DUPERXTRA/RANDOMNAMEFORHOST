const Discord = require("discord.js");
const fs = require("fs");
const snekfetch = require("snekfetch");

var bot = new Discord.Client();
bot.commands = new Discord.Collection();
bot.mutes = require("./mutes.json");
bot.bans = require("./bans.json");
bot.warns = require("./warns.json");
bot.remind = require("./reminders.json");


fs.readdir("./commands/", (err, files) => {
    if (err) console.error(err);

    let cmdfiles = files.filter(f => f.split(".").pop() === "js");
    if (cmdfiles.length <= 0) {
        console.log("No commands to load!");
        return;
    }

    console.log(`Loading ${cmdfiles.length} commands!`);

    cmdfiles.forEach((f, i) => {
        let props = require(`./commands/${f}`);
        console.log(`${i + 1}: ${f} loaded!`);
        bot.commands.set(props.help.name, props);
    });
    });

bot.on("guildMemberAdd", (member) => {
    const guild = member.guild;
    const embed = new Discord.RichEmbed()
    .setTitle("Welcome!")
    .setAuthor("BlyatBot", bot.user.avatarURL)
    .setColor("#FF0000")
    .setDescription(`Hello ${member.user.username}! Welcome to the Server ${guild.name}. Here is some information about the server.`)
    .setFooter("BlyatBot from Scottmg_YT", bot.user.avatarURL)
    .setTimestamp()
    .addBlankField()
    .addField("Name",`${guild.name}`, true)
    .addField("ID", `${guild.id}`, true)
    .addField("Server Owner:",`${guild.owner}`, true)
    .addField("Members Amount", `${guild.memberCount}`, true)
    .addField("Server Created At:", `${guild.createdAt}`)
    .addField("Server Region", `${guild.region}`)
    .addField("verificationLevel", `${guild.verificationLevel}`);

    member.send(embed);

});


bot.on("ready",function(){
  bot.user.setActivity(`Prefix: blyat |Servers: ${bot.guilds.size} `)
    bot.user.setStatus('dnd')

    const snekfetch = require('snekfetch')

    setInterval(() => {
      snekfetch.post(`https://discordbots.org/api/bots/stats`)
        .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQxNDU0OTI2Mzg5NzU5MTgwOCIsImJvdCI6dHJ1ZSwiaWF0IjoxNTE4OTIxMjM4fQ.nG9vjBuBJiyhx4qGB-DO5WHikd77POTJL-J4uOq5nuU')
        .send({ server_count: bot.guilds.size })
        .then(() => console.log('Updated discordbots.org stats.'))
        .catch(err => console.error(`Whoops something went wrong: ${err.body}`));
    }, 3600000)

    bot.on('guildDelete', guild => {
      console.log(`I have left ${guild.name} at ${new Date()}`);
    });

    bot.on('guildCreate', guild => {
      console.log(`I have joined ${guild.name} at ${new Date()}`);
    });


    bot.setInterval(() => {
        for (let i in bot.mutes) {
            let time = bot.mutes[i].time;
            let guildID = bot.mutes[i].guild;
            let guild = bot.guilds.get(guildID);
            let member = guild.members.get(i);
            let mutedRole = guild.roles.find(r => r.name === "BB TimedMuted");
           // console.log(Date.now());
            //  console.log(time);
            console.log(mutedRole.id);
            console.log("----------------------------------");
            if (!mutedRole) continue;

            if (Date.now() > bot.mutes[i].time) {
                console.log(`${member.user.tag}`)
                member.removeRole(mutedRole);
                delete bot.mutes[i];

                fs.writeFile("./mutes.json", JSON.stringify(bot.mutes), err=> {
                    if (err) throw err;
                    console.log(`${member.user.tag} has been unmuted!`);
                    member.send(`You are no longer guilty.`);
                });
            }
        }

        for (let i in bot.bans){
         let time = bot.bans[i].time;
         let guildID = bot.bans[i].guild;
         let guild = bot.guilds.get(guildID);
         let member = bot.bans[i].user;

        if(!member) continue;
         if (Date.now() > bot.bans[i].time) {
                guild.unban(member);
                delete bot.bans[i];

                fs.writeFile("./bans.json", JSON.stringify(bot.bans), err=> {
                    if (err) throw err;
                });
            }
        }

         for (let i in bot.remind) {
            let guild = bot.guilds.get(bot.remind[i].guild);
            let time = bot.remind[i].time;
            let member = guild.members.get(i);

            if (Date.now() > bot.remind[i].time) {
                member.send("Ich sollte dich erinnern, Genosse:\n"+
                    bot.remind[i].notification);
                delete bot.remind[i];

                fs.writeFile("./reminders.json", JSON.stringify(bot.remind), err=> {
                    if (err) throw err;
                });
            }
        }

    }, 3000);
});


bot.on("message", function(message){

	if (message.author.equals(bot.user)) return;

	const swearWords = ["nigger", "faggot","idiot", "bitch", "🇳ℹ🇬🇬🇪🇷", "🇳🇮🇬🇬🇪🇷", "shit","shitt"];
	if (swearWords.some(word => message.content.toLowerCase().includes(word))) {
	    message.reply("Censored blyat!!");   //censored blyat!
	    message.delete();
	}

	if(!message.content.startsWith('blyat')) return;

	let msgArr = message.content.split(" ");
	let command = msgArr[1];
	let args = msgArr.slice(2, msgArr.length);

	console.log(command);

	let cmd = bot.commands.get(command);

	if (cmd) {
	    cmd.run(bot, message, args);
	}

});


bot.login(process.env.BOT_TOKEN);
