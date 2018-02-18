module.exports.run = async (bot, message, args) => {
    if(!message.member.hasPermission("KICK_MEMBERS") )
                return message.reply("Sorry, you do not have the required rights to kick someone!");

            let member = message.mentions.members.first();
            if(!member)
            return message.reply("Please @ mention a user!");
            if(!member.kickable)
            return message.reply("Blyat! I can not kick the user, Does he have a higher role or are I missing the rights?");


            let reason = args.slice(2).join(' ');
            if(!reason)
          return message.reply("Blyat, you need a reason to kick someone!");

        await member.send(`You were kicked by ${message.author.tag} Reason: ${reason}`);


        member.kick(reason)
          .catch(error => message.reply(`Sorry ${message.author} could not kick because : ${error}`));
        message.reply(`${member.user.tag} was kicked by ${message.author.tag} Reason: ${reason}`);

}

module.exports.help = {
    name: "kick"
}
