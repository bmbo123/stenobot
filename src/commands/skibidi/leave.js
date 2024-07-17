const { SlashCommandBuilder } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('leave')
		.setDescription('Leaves the Channel!'),
	async execute(interaction) { 
        const channel = interaction.member.voice.channel;
        const connection = getVoiceConnection(channel.guild.id);
        console.log(connection);
        await connection.destroy();
        interaction.reply(`Left ${channel.name}!`);
	},
};