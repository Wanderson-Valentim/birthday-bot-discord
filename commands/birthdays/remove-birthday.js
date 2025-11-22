const { SlashCommandBuilder, MessageFlags, PermissionFlagsBits } = require('discord.js');
const MessageBuilder = require('../../utils/messageBuilder.js');
const { handleCommandError } = require('../../utils/errorHandler.js');

module.exports = {
	data: new SlashCommandBuilder().setName('remover-aniversario')
		.setDescription('Remove o aniversário de um membro.')
		.addUserOption((option) => option.setName('aniversariante')
			.setDescription('O membro cujo aniversário será removido.')
			.setRequired(true))
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	adminOnly: true,
	async execute(interaction) {
		try {
			const user = interaction.options.getUser('aniversariante');
			const birthdaysRepo = interaction.client.repositories.birthdays;

			const itWasRemoved = await birthdaysRepo.destroy(interaction.guildId, String(user.id));

			if (!itWasRemoved) {
				await interaction.reply({
					embeds: MessageBuilder.info(`O aniversário de ${user} não estava registrado.`),
					flags: MessageFlags.Ephemeral,
				});
				return;
			}

			await interaction.reply({
				embeds: MessageBuilder.success(`O aniversário de ${user} foi removido com sucesso.`),
				flags: MessageFlags.Ephemeral,
			});
		}
		catch (error) {
			handleCommandError({
				interaction,
				error,
				logContext: 'BIRTHDAYS',
				userMessage: 'Ocorreu um erro ao tentar remover. Por favor, tente novamente.',
			});
		}
	},
	requiresDb: true,
};