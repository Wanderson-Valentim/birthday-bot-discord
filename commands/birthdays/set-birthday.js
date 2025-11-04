const { SlashCommandBuilder, MessageFlags, codeBlock } = require('discord.js');
const birthdaysRepo = require('../../repositories/birthdaysRepository.js');
const guildSettingsRepo = require('../../repositories/guildSettingsRepository.js');
const MessageBuilder = require('../../utils/messageBuilder.js');
const { handleCommandError } = require('../../utils/errorHandler.js');

module.exports = {
	data: new SlashCommandBuilder().setName('definir-aniversario')
		.setDescription('Registra ou atualiza o aniversário de um membro. O ano de nascimento é opcional.')
		.addUserOption((option) => option.setName('aniversariante')
			.setDescription('O membro a ser parabenizado.')
			.setRequired(true))
		.addIntegerOption((option) => option.setName('dia')
			.setDescription('O dia do aniversário (1-31).')
			.setRequired(true)
			.setMinValue(1)
			.setMaxValue(31))
		.addIntegerOption((option) => option.setName('mês')
			.setDescription('O mês do aniversário (1-12).')
			.setRequired(true)
			.setMinValue(1)
			.setMaxValue(12)),

	async execute(interaction) {
		try {
			const user = interaction.options.getUser('aniversariante');
			const day = interaction.options.getInteger('dia');
			const month = interaction.options.getInteger('mês');

			const userId = user.id;
			const guildId = interaction.guildId;

			const guildSettings = await guildSettingsRepo.getByGuilId(guildId);

			const notConfigured = Object.keys(guildSettings.dataValues).some(
				(key) => guildSettings.dataValues[key] === null,
			);

			if (notConfigured) {
				await interaction.reply({
					embeds: MessageBuilder.info(
						'O bot ainda não foi totalmente configurado.\n\n' +
						'Use o comando abaixo para verificar as configurações atuais e ver o que está faltando:\n' +
						codeBlock('/ver-configuracoes'),
					),
					flags: MessageFlags.Ephemeral,
				});
				return;
			}

			const existingBirthday = await birthdaysRepo.getOne(guildId, userId);

			if (existingBirthday) {
				await birthdaysRepo.update(
					guildId,
					userId,
					{ day, month },
				);

				await interaction.reply({
					embeds: MessageBuilder.success(`O aniversário de ${user} foi atualizado para ${day}/${month}.`),
					flags: MessageFlags.Ephemeral,
				});
			}
			else {
				await birthdaysRepo.create({
					user_id: userId,
					guild_id: guildId,
					day,
					month,
				});

				await interaction.reply({
					embeds: MessageBuilder.success(`O aniversário de ${user} foi registrado como ${day}/${month}.`),
					flags: MessageFlags.Ephemeral,
				});
			}
		}
		catch (error) {
			handleCommandError({
				interaction,
				error,
				logContext: 'BIRTHDAYS',
				userMessage: 'Ocorreu um erro ao tentar definir aniversário. Por favor, tente novamente.',
			});
		}
	},
	requiresDb: true,
};