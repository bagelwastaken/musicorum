module.exports = {
	name: 'guildCreate',
	once: false,
	execute: async (guild, client) => {

		client.channels.cache.get('935977503363858442').send({ content: `New server joined: ${guild.name} (id: ${guild.id}). This server has ${guild.memberCount} members!` });

		guild.systemChannel.send('Hello. I am Musicorum! Thanks for inviting me! To get started please use /help, otherwise please join the official server: https://discord.gg/GX4Sz9RZew');
	},
};