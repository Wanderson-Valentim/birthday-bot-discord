const { REST, Routes } = require('discord.js');

const clientId = process.env.DISCORD_CLIENT_ID;
const guildId = process.env.DISCORD_DEV_GUILD_ID;
const token = process.env.DISCORD_BOT_TOKEN;

if (!clientId || !token) {
	console.error('Error: DISCORD_CLIENT_ID or DISCORD_BOT_TOKEN not set in environment variables.');
	process.exit(1);
}

const rest = new REST().setToken(token);

(async () => {
	try {
		let route;
		let scope;

		if (process.argv.includes('--global')) {
			scope = 'global';
			route = Routes.applicationCommands(clientId);
		}
		else {
			if (!guildId) {
				console.error('Error: DISCORD_DEV_GUILD_ID not set.');
				console.log('Hint: To clear globally, use: node --env-file=.env clear-commands.js --global');
				process.exit(1);
			}
			scope = `guild (${guildId})`;
			route = Routes.applicationGuildCommands(clientId, guildId);
		}

		console.log(`Started removing all application commands from scope: ${scope}.`);

		await rest.put(route, { body: [] });

		console.log(`Successfully removed commands from scope: ${scope}.`);
	}
	catch (error) {
		console.error(error);
	}
})();