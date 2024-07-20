const { SlashCommandBuilder } = require('discord.js');
const {pipeline} = require('stream');
const { joinVoiceChannel, VoiceReceiver, EndBehaviorType } = require('@discordjs/voice');
const { OpusEncoder } = require('@discordjs/opus');
const  prism  = require('prism-media');

const fs = require('fs');



function createListeningStream(receiver, userID) {
  const opusStream = receiver.subscribe(userID,{
    end: {
      behavior: EndBehaviorType.AfterSilence,
      duration: 100,
    },
  });
  const opusDecoder = new prism.opus.Decoder({ frameSize: 960, channels: 2, rate: 48000 });
  const filename = 'output.mp3';
  const out = fs.createWriteStream(filename);

  opusStream.pipe(opusDecoder).pipe(out);

  opusStream.on('data', (data) => {
    console.log(`Received ${chunk.length} bytes of data.`);
    out.write(data);
    console.log('4. Wrote data to file');
  });

  opusStream.on('end', () => {
    console.log('Stream ended!');
    out.end();
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
    
      connection.receiver.speaking.on("start", (userID) => { 
        createListeningStream(connection.receiver, userID);
       })
      
      await interaction.reply(`Joined ${channel.name}!`);
    }
	},
};