const { Events, MessageFlags } = require('discord.js');
const guildSettingsRepo = require('../repositories/guildSettingsRepository.js');

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
				const [settings, created] = await guildSettingsRepo.getOrCreate(interaction.guildId);

				if (created) {
					console.log(`[DB] Server ${interaction.guild.name} (ID: ${interaction.guildId}) was registered for the first time.`);
				}

				interaction.settings = settings;
			}
			catch (dbError) {
				console.error('Failed to check/create GuildSettings:', dbError);
				await interaction.reply({
					content: 'There was an error accessing the database. Please try again.',
					flags: MessageFlags.Ephemeral,
				});
				return;
			}
		}

		try {
			await command.execute(interaction);
		}
		catch (error) {
			console.error('[COMMAND_EXECUTION_ERROR]');
			console.error(`Command: /${interaction.commandName}`);
			console.error(`User: ${interaction.user.tag} (ID: ${interaction.user.id})`);

			if (interaction.inGuild()) {
				console.error(`Guild: ${interaction.guild.name} (ID: ${interaction.guildId})`);
			}

			console.error(error);

			const errorMessage = {
				content: '❌ Ocorreu um erro ao tentar executar este comando. Por favor, tente novamente.',
				flags: MessageFlags.Ephemeral,
			};

			if (interaction.replied || interaction.deferred) {
				await interaction.followUp(errorMessage);
			}
			else {
				await interaction.reply(errorMessage);
			}
		}
	},
};