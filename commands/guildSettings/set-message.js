const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const guildSettingsRepo = require('../../repositories/guildSettingsRepository.js');
const MessageBuilder = require('../../utils/messageBuilder.js');

module.exports = {
	data: new SlashCommandBuilder().setName('definir-mensagem')
		.setDescription('Define ou atualiza a mensagem de aniversário.').addStringOption((option) => option.setName('mensagem')
			.setDescription('Mensagem de aniversário.')
			.setRequired(true)),

	async execute(interaction) {
		try {
			const newMessage = interaction.options.getString('mensagem');

			await guildSettingsRepo.update(
				interaction.guildId,
				{ birthday_message: newMessage },
			);

			await interaction.reply({
				embeds: MessageBuilder.success(`A mensagem de aniversário foi atualizada para:\n\`${newMessage}\``),
				flags: MessageFlags.Ephemeral,
			});
		}
		catch (error) {
			console.error(`[DB_SAVE_ERROR] Failed to save settings for /${interaction.commandName}.`);
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