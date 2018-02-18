const fs = require("fs");
const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
    if(!message.member.hasPermission("MANAGE_MESSAGES") )
                return message.reply("Sorry, you do not have the rights to warn anyone!");

        let member = message.mentions.members.first() || message.guild.members.get(args[0]);
        if(!member)
            return message.reply("Please @ mention a user or give his ID!");


        let reason = args.slice(2).join(' ');
        if(!reason)
            return message.reply("Blyat, you need a reason to warn someone!");

        await member.user.send(`You have been warned by ${message.author.tag} Reason: ${reason}`);

        var embed = new Discord.RichEmbed()
                    .setAuthor("BlyatBot", bot.user.avatarURL)
                    .setColor([255, 0, 0])
                    .setDescription("**WARNING**\n" +
                    member.user.username +"#"+ member.user.discriminator +
                    ` was warned by ${message.author.username} \n` +
                    `**Reason:** \n` +
                    reason)

        message.channel.send(embed);

        if(!bot.warns[member.id]) warns = 0;
        else warns = bot.warns[member.id].warns;

        warns += 1;

        if(warns >= 3){
            if(member.kickable){
                delete bot.warns[member.id];

                await member.user.send("You received 3 warnings!");

                var embed = new Discord.RichEmbed()
                    .setAuthor("BlyatBot", bot.user.avatarURL)
                    .setColor([255, 0, 0])
                    .setDescription("**WARNING**\n" +
                    member.user.username +"#"+ member.user.discriminator +
                    ` was kicked after 3 warnings. \ n` +
                    `**Reason for the Last Warning:** \n` +
                    reason)

                message.channel.send(embed);

                member.kick("You received 3 warnings!");

            }
        }
        else {
            bot.warns[member.id] = {
                guild: message.guild.id,
                user: member.id,
                name: member.user.username,
                warns: warns
            }
        }

        fs.writeFile("./warns.json", JSON.stringify(bot.warns, null, 4), err => {
            if(err) throw err;

          });


}

module.exports.help = {
    name: "warn"
}
