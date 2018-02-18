const fs = require("fs");

module.exports.run = async (bot, message, args) => {
    if(!message.member.hasPermission("BAN_MEMBERS") )
                return message.reply("Sorry, you do not have the rights to ban someone!");

        let member = message.mentions.members.first() || message.guild.members.get(args[0]);
        if(!member)
            return message.reply("Please @ mention a user or give his ID!");
        if(!member.kickable)
            return message.reply("Blyat! I can not ban the user, Does he have a higher role or are I missing the rights?");

        
        let reason = args.slice(2).join(' ');
        let time = 3155760000 * 1000
        if(!reason)
            return message.reply("Blyat, you need a reason to ban someone!");

        await member.user.send(`You were banned by ${message.author.tag}. Reason: ${reason}`);
        await member.user.send("https://i.imgur.com/O3DHIA5.gif");
        bot.bans[member.id] = {
            guild: message.guild.id,
            user: member.id,
            name: member.user.username,
            time: time
         }

        fs.writeFile("./bans.json", JSON.stringify(bot.bans, null, 4), err => {
            if(err) throw err;

          });

        //and now we ban...
        member.ban(reason)
          .catch(error => message.reply(`Sorry ${message.author} could not ban because:${error}`));



        message.reply(`${member.user.tag} was banned by ${message.author.tag} Reason: ${reason}`);
        message.channel.send("https://i.imgur.com/O3DHIA5.gif");

}

module.exports.help = {
    name: "ban"
}
