const { SlashCommandBuilder, MessageFlags, PermissionFlagsBits } = require('discord.js');
const MessageBuilder = require('../../utils/messageBuilder.js');
const { handleCommandError } = require('../../utils/errorHandler.js');

module.exports = {
	data: new SlashCommandBuilder().setName('ver-configuracoes')
		.setDescription('Exibe as configurações atuais do servidor.')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	adminOnly: true,
	async execute(interaction) {
		try {
			const settingsRepo = interaction.client.repositories.settings;

			const guildSettings = await settingsRepo.getByGuildId(
				interaction.guildId,
			);

			await interaction.reply({
				embeds: MessageBuilder.settings(interaction.guild.name, guildSettings),
				flags: MessageFlags.Ephemeral,
			});
		}
		catch (error) {
			handleCommandError({
				interaction,
				error,
				logContext: 'GUILD SETTINGS',
				userMessage: 'Ocorreu um erro ao tentar buscar suas configurações. Por favor, tente novamente.',
			});
		}
	},
	requiresDb: true,
};