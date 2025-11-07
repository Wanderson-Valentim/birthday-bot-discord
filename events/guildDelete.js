const { Events } = require('discord.js');

module.exports = {
	name: Events.GuildDelete,
	async execute(guild) {
		console.log(`[GUILD_DELETE] Bot was removed from: ${guild.name} (ID: ${guild.id})`);

		try {
			const settingsRepo = guild.client.repositories.settings;

			await settingsRepo.destroy(guild.id);

			console.log(`[GUILD_DELETE] Successfully pruned all data for ${guild.name}.`);
		}
		catch (error) {
			console.error(`[GUILD_DELETE_ERROR] Failed to prune data for ${guild.id}`, error);
		}
	},
};