
module.exports.run = async (bot, message, args) => {

        let poll = args.join(' ');
        if(!poll)
            return message.reply("Blyat, you already need a question if someone is to vote.");

        message.channel.send(`**Umfrage von ${message.author}:** \n` + poll).then(function (message) {
              message.react("👍")
              message.react("👎")
            });


}

module.exports.help = {
    name: "poll"
}
