const { SlashCommandBuilder } = require('discord.js');
const {pipeline} = require('stream');
const { joinVoiceChannel, VoiceReceiver } = require('@discordjs/voice');
const { OpusEncoder } = require('@discordjs/opus');
const  prism  = require('prism-media');

const fs = require('fs');



function createListeningStream(receiver, userID) {
  const opusStream = receiver.subscribe(userID,{
    end: {
      behavior: 0,
      duration: 1000,
    },
  });

  const filename = 'output.mp3';
  const out = fs.createWriteStream(filename);

  pipeline(opusStream, out, (err) => {
    if (err) {
      console.error('Something went wrong!', err);
    } else {
      console.log('Done!');
    }
  });
  
}


module.exports = {
	data: new SlashCommandBuilder()
		.setName('join')
		.setDescription('Joins the channel and starts listening!'),
	async execute(interaction) { 
    const channel = interaction.member.voice.channel;
    if(channel) {
      const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
        selfDeaf: false,
      });
      const receiver =  new VoiceReceiver(connection);
      createListeningStream(receiver, '423239914998464514');
      
      connection.receiver.speaking.on("start", (userID) => { 
        console.log(userID)
       })
      
      await interaction.reply(`Joined ${channel.name}!`);
    }
	},
};