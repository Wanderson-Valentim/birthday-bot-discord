const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const guildSettingsRepo = require('../../repositories/guildSettingsRepository.js');

module.exports = {
	data: new SlashCommandBuilder().setName('definir-cargo')
		.setDescription('Define ou atualiza o cargo especial a ser dado no dia do aniversário.')
		.addRoleOption((option) => option.setName('cargo')
			.setDescription('Cargo a ser dado no dia do aniversário.')
			.setRequired(true)),

	async execute(interaction) {
		try {
			const role = interaction.options.getRole('cargo');

			const newRoleId = role.id;

			const settings = interaction.settings;
			const currentRoleId = settings.birthday_role_id;

			if (newRoleId === currentRoleId) {
				await interaction.reply({
					content: `O cargo ${role.toString()} já é o definido. Nenhuma alteração foi feita.`,
					flags: MessageFlags.Ephemeral,
				});
				return;
			}

			await guildSettingsRepo.update(
				interaction.guildId,
				{ birthday_role_id: newRoleId },
			);

			await interaction.reply({
				content: `✅ O cargo de aniversário foi atualizado para ${role.toString()}!`,
				flags: MessageFlags.Ephemeral,
			});
		}
		catch (error) {
			console.error(`[DB_SAVE_ERROR] Failed to save settings for /${interaction.commandName}.`);
			console.error(`Guild: ${interaction.guild.name} (ID: ${interaction.guildId})`);
			console.error(error);

			const errorMessage = {
				content: '❌ Ocorreu um erro ao tentar salvar sua configuração. Por favor, tente novamente.',
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