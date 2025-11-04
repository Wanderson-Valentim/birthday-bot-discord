const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const guildSettingsRepo = require('../../repositories/guildSettingsRepository.js');
const MessageBuilder = require('../../utils/messageBuilder.js');

module.exports = {
	data: new SlashCommandBuilder().setName('ver-configuracoes')
		.setDescription('Exibe as configurações atuais do servidor.'),

	async execute(interaction) {
		try {
			const guildSettings = await guildSettingsRepo.getByGuilId(
				interaction.guildId,
			);

			await interaction.reply({
				embeds: MessageBuilder.settings(interaction.guild.name, guildSettings),
				flags: MessageFlags.Ephemeral,
			});
		}
		catch (error) {
			console.error(`[DB_SAVE_ERROR] Failed to fetch settings for /${interaction.commandName}.`);
			console.error(`Guild: ${interaction.guild.name} (ID: ${interaction.guildId})`);
			console.error(error);

			const errorMessage = {
				embeds: MessageBuilder.error('Ocorreu um erro ao tentar salvar sua configuração. Por favor, tente novamente.'),
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