const { Events, MessageFlags, PermissionFlagsBits } = require('discord.js');
const MessageBuilder = require('../utils/messageBuilder.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (!interaction.isChatInputCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		if (command.adminOnly) {
			if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
				await interaction.reply({
					embeds: MessageBuilder.error('Você não tem permissão para executar este comando. Apenas administradores podem usá-lo.'),
					flags: MessageFlags.Ephemeral,
				});
				return;
			}
		}

		if (command.requiresDb) {
			try {
				const settingsRepo = interaction.client.repositories.settings;

				const [settings, created] = await settingsRepo.getOrCreate(interaction.guildId);

				if (created) {
					console.log(`[DB] Server ${interaction.guild.name} (ID: ${interaction.guildId}) was registered for the first time.`);
				}

				interaction.settings = settings;
			}
			catch (dbError) {
				console.error('[DB ERROR] Failed to check/create GuildSettings:', dbError);
				await interaction.reply({
					embeds: MessageBuilder.error('Ocorreu um erro ao tentar executar este comando. Por favor, tente novamente mais tarde.'),
					flags: MessageFlags.Ephemeral,
				});
				return;
			}
		}

		try {
			await command.execute(interaction);
		}
		catch (error) {
			handleCommandError({
				interaction,
				error,
				logContext: 'INTERACTION CREATE',
				userMessage: 'Ocorreu um erro ao tentar executar este comando. Por favor, tente novamente.',
			});
		}
	},
};