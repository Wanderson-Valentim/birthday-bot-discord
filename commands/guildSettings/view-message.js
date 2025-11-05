const { SlashCommandBuilder, MessageFlags, codeBlock } = require('discord.js');
const MessageBuilder = require('../../utils/messageBuilder.js');
const { handleCommandError } = require('../../utils/errorHandler.js');

module.exports = {
	data: new SlashCommandBuilder().setName('ver-mensagem')
		.setDescription('Exibe a mensagem de aniversário definida do servidor.'),

	async execute(interaction) {
		try {
			const settingsRepo = interaction.client.repositories.settings;

			const guildSettings = await settingsRepo.getByGuildId(
				interaction.guildId,
			);

			if (guildSettings.birthday_message === null) {
				await interaction.reply({
					embeds: MessageBuilder.info(
						'A mensagem ainda não foi configurada.\n\n' +
						'Use o comando abaixo para definir a mensagem:\n' +
						codeBlock('/definir-mensagem'),
					),
					flags: MessageFlags.Ephemeral,
				});
				return;
			}

			await interaction.reply({
				content: guildSettings.birthday_mention_everyone ? '@everyone' : null,
				embeds: MessageBuilder.message(guildSettings),
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