const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const MessageBuilder = require('../../utils/messageBuilder.js');
const { handleCommandError } = require('../../utils/errorHandler.js');

module.exports = {
	data: new SlashCommandBuilder().setName('proximos-aniversarios')
		.setDescription('Lista os aniversários que ocorrerão nos próximos 3 meses.'),
	adminOnly: false,
	async execute(interaction) {
		try {
			const monthsToFetch = 3;

			const birthdaysRepo = interaction.client.repositories.birthdays;

			const upcoming = await birthdaysRepo.getUpcomingByMonths(interaction.guildId, monthsToFetch);

			if (upcoming.length === 0) {
				await interaction.reply({
					embeds: MessageBuilder.info(`Não há aniversários cadastrados nos próximos ${monthsToFetch} meses.`),
					flags: MessageFlags.Ephemeral,
				});
				return;
			}

			await interaction.reply({
				embeds: MessageBuilder.list(`🎉 Aniversários nos próximos ${monthsToFetch} meses`, upcoming),
				flags: MessageFlags.Ephemeral,
			});
		}
		catch (error) {
			handleCommandError({
				interaction,
				error,
				logContext: 'BIRTHDAYS',
				userMessage: 'Ocorreu um erro ao tentar buscar informações. Por favor, tente novamente.',
			});
		}
	},
	requiresDb: true,
};