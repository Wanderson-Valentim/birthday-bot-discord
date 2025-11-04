const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const MessageBuilder = require('../../utils/messageBuilder.js');
const { handleCommandError } = require('../../utils/errorHandler.js');

module.exports = {
	data: new SlashCommandBuilder().setName('definir-mensagem')
		.setDescription('Define ou atualiza a mensagem de aniversário.').addStringOption((option) => option.setName('mensagem')
			.setDescription('Mensagem de aniversário.')
			.setRequired(true)),

	async execute(interaction) {
		try {
			const newMessage = interaction.options.getString('mensagem');
			const settingsRepo = interaction.client.repositories.settings;

			await settingsRepo.update(
				interaction.guildId,
				{ birthday_message: newMessage },
			);

			await interaction.reply({
				embeds: MessageBuilder.success(`A mensagem de aniversário foi atualizada para:\n\`${newMessage}\``),
				flags: MessageFlags.Ephemeral,
			});
		}
		catch (error) {
			handleCommandError({
				interaction,
				error,
				logContext: 'GUILD SETTINGS',
				userMessage: 'Ocorreu um erro ao tentar salvar sua configuração. Por favor, tente novamente.',
			});
		}
	},
	requiresDb: true,
};