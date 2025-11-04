const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const birthdaysRepo = require('../../repositories/birthdaysRepository.js');
const MessageBuilder = require('../../utils/messageBuilder.js');

module.exports = {
	data: new SlashCommandBuilder().setName('proximos-aniversarios')
		.setDescription('Lista os aniversários que ocorrerão nos próximos 3 meses.'),
	async execute(interaction) {
		try {
			const monthsToFetch = 3;
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
			console.error(`[DB_SAVE_ERROR] Failed to fetch data for /${interaction.commandName}.`);
			console.error(`Guild: ${interaction.guild.name} (ID: ${interaction.guildId})`);
			console.error(error);

			const errorMessage = {
				embeds: MessageBuilder.error('Ocorreu um erro ao tentar buscar informações. Por favor, tente novamente.'),
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
	requiresDb: true,
};