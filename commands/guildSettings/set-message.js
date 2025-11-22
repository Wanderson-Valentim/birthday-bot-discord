const { SlashCommandBuilder, MessageFlags, PermissionFlagsBits } = require('discord.js');
const MessageBuilder = require('../../utils/messageBuilder.js');
const { handleCommandError } = require('../../utils/errorHandler.js');

module.exports = {
	data: new SlashCommandBuilder().setName('definir-mensagem')
		.setDescription('Define ou atualiza a mensagem de aniversário.')
		.addStringOption((option) => option.setName('título')
			.setDescription('O título da mensagem.')
			.setRequired(true))
		.addStringOption((option) => option.setName('mensagem')
			.setDescription('A mensagem. Use {user} no local onde o aniversariante deve ser marcado.')
			.setRequired(true))
		.addBooleanOption((option) => option.setName('habilitar-marcar-everyone')
			.setDescription('Se verdadeiro (True), permite que a mensagem marque @everyone.')
			.setRequired(true))
		.addStringOption((option) => option.setName('cor')
			.setDescription('Cor do detalhe do embed em hexadecimal (ex: #FF5733). Opcional.')
			.setRequired(false))
		.addStringOption((option) => option.setName('link-imagem')
			.setDescription('Link de uma imagem para o embed da mensagem. Opcional.')
			.setRequired(false))
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	adminOnly: true,
	async execute(interaction) {
		try {
			const newData = {
				birthday_message_title: interaction.options.getString('título'),
				birthday_message: interaction.options.getString('mensagem'),
				birthday_mention_everyone: interaction.options.getBoolean('habilitar-marcar-everyone'),
				birthday_message_image_url: interaction.options.getString('link-imagem'),
				birthday_message_color: interaction.options.getString('cor'),
			};

			if (newData.birthday_message_color) {
				const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
				if (!hexColorRegex.test(newData.birthday_message_color)) {
					await interaction.reply({
						embeds: MessageBuilder.error('A cor fornecida não é um código hexadecimal válido. Use o formato (ex: #FF5733).'),
						flags: MessageFlags.Ephemeral,
					});
					return;
				}
			}

			const settingsRepo = interaction.client.repositories.settings;

			await settingsRepo.update(
				interaction.guildId,
				newData,
			);

			await interaction.reply({
				content: newData.birthday_mention_everyone ? '@everyone' : null,
				embeds: MessageBuilder.message(newData),
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