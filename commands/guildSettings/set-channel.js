const { SlashCommandBuilder, ChannelType, MessageFlags } = require('discord.js');
const MessageBuilder = require('../../utils/messageBuilder.js');
const { handleCommandError } = require('../../utils/errorHandler.js');

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
					embeds: MessageBuilder.info(`O canal ${channel.toString()} já é o canal definido para anúncios. Nenhuma alteração foi feita.`),
					flags: MessageFlags.Ephemeral,
				});
				return;
			}

			const settingsRepo = interaction.client.repositories.settings;

			await settingsRepo.update(
				interaction.guildId,
				{ notification_channel_id: newChannelId },
			);

			await interaction.reply({
				embeds: MessageBuilder.success(`O canal de anúncios de aniversário foi atualizado para ${channel.toString()}!`),
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