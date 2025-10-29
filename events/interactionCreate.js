const { Events, MessageFlags } = require('discord.js');
const GuildSettings = require('../database').GuildSettings;

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (!interaction.isChatInputCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		if (command.requiresDb) {
			try {
				const [settings, created] = await GuildSettings.findOrCreate({
					where: { guild_id: interaction.guildId },
					defaults: { guild_id: interaction.guildId },
				});

				if (created) {
					console.log(`[DB] Server ${interaction.guild.name} (ID: ${interaction.guildId}) was registered for the first time.`);
				}

				interaction.settings = settings;
			}
			catch (dbError) {
				console.error('Failed to check/create GuildSettings:', dbError);
				await interaction.reply({
					content: 'There was an error accessing the database. Please try again.',
					ephemeral: true,
				});
				return;
			}
		}

		try {
			await command.execute(interaction);
		}
		catch (error) {
			console.error(error);
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({
					content: 'There was an error while executing this command!',
					flags: MessageFlags.Ephemeral,
				});
			}
			else {
				await interaction.reply({
					content: 'There was an error while executing this command!',
					flags: MessageFlags.Ephemeral,
				});
			}
		}
	},
};