const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('join')
		.setDescription('Joins the Channel!'),
	async execute(interaction) { 
    const channel = interaction.member.voice.channel;
    if(channel) {
      const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
      });
      await interaction.reply(`Joined ${channel.name}!`);
    }
	},
};