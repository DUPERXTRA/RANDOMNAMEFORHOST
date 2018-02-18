const fs = require("fs");

module.exports.run = async (bot, message, args) => {

    if(!message.member.hasPermission("BAN_MEMBERS") )
                return message.reply("Sorry, you do not have the rights to unban someone!");


        let member = args[0];
        if(!member) {
            message.channel.send("Ok blyat, these are all banned users. I need the ID of the one you want to unban.")
            for (let i in bot.bans){
                if(bot.bans[i].guild === message.guild.id){
                    let name = bot.bans[i].name;
                    let id = bot.bans[i].user;
                    let time = bot.bans[i].time;
                    let tempBan = false;
                    if(time !== null && time < 3155760000 * 1000) tempBan = true;
                    message.channel.send(`Name: ${name}, ID: ${id}, Temp-Ban: ${tempBan}`);
                }
            }
        }

        if(member){
         message.guild.unban(member);
         delete bot.bans[member];

                fs.writeFile("./bans.json", JSON.stringify(bot.bans), err=> {
                    if (err) throw err;
                });
         message.channel.send("Alright, I have unbanned He/She.")
     }

}

module.exports.help = {
    name: "unban"
}
