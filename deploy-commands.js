const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

const clientId = process.env.DISCORD_CLIENT_ID;
const guildId = process.env.DISCORD_DEV_GUILD_ID;
const token = process.env.DISCORD_BOT_TOKEN;

if (!clientId || !token) {
	console.error('Error: DISCORD_CLIENT_ID or DISCORD_BOT_TOKEN not set in environment variables.');
	process.exit(1);
}

const commands = [];
// Grab all the command folders from the commands directory you created earlier
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	// Grab all the command files from the commands directory you created earlier
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));
	// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			commands.push(command.data.toJSON());
		}
		else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(token);

// and deploy your commands!
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		let route;

		if (process.argv.includes('--global')) {
			console.log('Deploying commands globally...');
			// Route for deploying commands globally
			route = Routes.applicationCommands(clientId);
		}
		else {
			// Default deployment to development guild
			if (!guildId) {
				console.error('Error: DISCORD_DEV_GUILD_ID not set in environment variables.');
				console.log('Hint: To deploy globally, use: node --env-file=.env deploy-commands.js --global');
				process.exit(1);
			}
			console.log(`Deploying commands to guild: ${guildId}`);
			route = Routes.applicationGuildCommands(clientId, guildId);
		}

		const data = await rest.put(route, { body: commands });

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	}
	catch (error) {
		console.error(error);
	}
})();