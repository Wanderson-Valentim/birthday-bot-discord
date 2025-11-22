const { SlashCommandBuilder, MessageFlags, codeBlock, PermissionFlagsBits } = require('discord.js');
const MessageBuilder = require('../../utils/messageBuilder.js');
const { handleCommandError } = require('../../utils/errorHandler.js');
const { getTodayDateParts, getTodayString } = require('../../utils/dateUtils.js');
const { announceBirthday } = require('../../utils/announcer.js');

module.exports = {
	data: new SlashCommandBuilder().setName('definir-aniversario')
		.setDescription('Registra ou atualiza o aniversário de um membro.')
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
			.setMaxValue(12))
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	adminOnly: true,
	async execute(interaction) {
		try {
			const user = interaction.options.getUser('aniversariante');
			const day = interaction.options.getInteger('dia');
			const month = interaction.options.getInteger('mês');

			const userId = user.id;
			const guildId = interaction.guildId;

			const birthdaysRepo = interaction.client.repositories.birthdays;

			const guildSettings = interaction.settings;

			const notConfigured =
				guildSettings.notification_channel_id === null ||
				guildSettings.birthday_role_id === null ||
				guildSettings.birthday_message === null;

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

			const todayParts = getTodayDateParts();
			const todayString = getTodayString();

			const isNewDateToday = (day === todayParts.day && month === todayParts.month);

			const hasJobRunToday = (guildSettings.last_announcement_date === todayString);

			const existingBirthday = await birthdaysRepo.getOne(guildId, userId);

			if (existingBirthday) {
				if (existingBirthday.day === day && existingBirthday.month === month) {
					await interaction.reply({
						embeds: MessageBuilder.info(`O aniversário de ${user} já está definido como ${day}/${month}.`),
						flags: MessageFlags.Ephemeral,
					});
					return;
				}

				await birthdaysRepo.update(
					guildId,
					userId,
					{ day, month },
				);

				if (!isNewDateToday) {
					const role = await interaction.guild.roles.fetch(guildSettings.birthday_role_id).catch(() => null);
					if (role) {
						const member = await interaction.guild.members.fetch(userId).catch(() => null);

						if (member && member.roles.cache.has(role.id)) {
							await member.roles.remove(role, 'Data de aniversário foi alterada');
						}
					}
				}

				if (isNewDateToday && hasJobRunToday) {
					const member = await interaction.guild.members.fetch(user.id);
					if (member) {
						await announceBirthday(interaction.guild, member, guildSettings);
					}
				}

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

				if (isNewDateToday && hasJobRunToday) {
					const member = await interaction.guild.members.fetch(user.id);
					if (member) {
						await announceBirthday(interaction.guild, member, guildSettings);
					}
				}

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