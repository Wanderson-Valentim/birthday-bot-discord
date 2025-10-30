const { SlashCommandBuilder, ChannelType, MessageFlags } = require('discord.js');
const guildSettingsRepo = require('../../repositories/guildSettingsRepository.js');

module.exports = {
	data: new SlashCommandBuilder().setName('definir-canal')
		.setDescription('Define ou atualiza o canal de texto onde as mensagens de aniversário serão enviadas.')
		.addChannelOption((option) => option.setName('canal')
			.setDescription('O canal de texto para anunciar os aniversários.')
			.addChannelTypes(ChannelType.GuildText)
			.setRequired(true)),

	async execute(interaction) {
		try {
			const channel = interaction.options.getChannel('canal');
			const newChannelId = channel.id;

			const settings = interaction.settings;
			const currentChannelId = settings.notification_channel_id;

			if (newChannelId === currentChannelId) {
				await interaction.reply({
					content: `O canal ${channel.toString()} já é o canal definido para anúncios. Nenhuma alteração foi feita.`,
					flags: MessageFlags.Ephemeral,
				});
				return;
			}

			await guildSettingsRepo.update(
				interaction.guildId,
				{ notification_channel_id: newChannelId },
			);

			await interaction.reply({
				content: `✅ O canal de anúncios de aniversário foi atualizado para ${channel.toString()}!`,
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