const { SlashCommandBuilder, MessageFlags, PermissionFlagsBits } = require('discord.js');
const MessageBuilder = require('../../utils/messageBuilder.js');
const { handleCommandError } = require('../../utils/errorHandler.js');

module.exports = {
	data: new SlashCommandBuilder().setName('definir-cargo')
		.setDescription('Define ou atualiza o cargo especial a ser dado no dia do aniversário.')
		.addRoleOption((option) => option.setName('cargo')
			.setDescription('Cargo a ser dado no dia do aniversário.')
			.setRequired(true))
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	adminOnly: true,
	async execute(interaction) {
		try {
			const role = interaction.options.getRole('cargo');

			const newRoleId = role.id;

			const settings = interaction.settings;
			const currentRoleId = settings.birthday_role_id;

			if (newRoleId === currentRoleId) {
				await interaction.reply({
					embeds: MessageBuilder.info(`O cargo ${role.toString()} já é o definido. Nenhuma alteração foi feita.`),
					flags: MessageFlags.Ephemeral,
				});
				return;
			}

			const settingsRepo = interaction.client.repositories.settings;

			await settingsRepo.update(
				interaction.guildId,
				{ birthday_role_id: newRoleId },
			);

			await interaction.reply({
				embeds: MessageBuilder.success(`O cargo de aniversário foi atualizado para ${role.toString()}!`),
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