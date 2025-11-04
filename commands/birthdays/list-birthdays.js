const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const birthdaysRepo = require('../../repositories/birthdaysRepository.js');
const MessageBuilder = require('../../utils/messageBuilder.js');
const { handleCommandError } = require('../../utils/errorHandler.js');

module.exports = {
	data: new SlashCommandBuilder().setName('listar-aniversarios')
		.setDescription('Lista todos os aniversários.'),
	async execute(interaction) {
		try {
			const birthdays = await birthdaysRepo.getAllByGuildId(interaction.guildId);

			if (birthdays.length === 0) {
				await interaction.reply({
					embeds: MessageBuilder.info('Não há aniversários cadastrados.'),
					flags: MessageFlags.Ephemeral,
				});
				return;
			}


			await interaction.reply({
				embeds: MessageBuilder.list(`🎉 Aniversários do servidor ${interaction.guild.name}`, birthdays),
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