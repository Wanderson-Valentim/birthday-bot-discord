const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const birthdaysRepo = require('../../repositories/birthdaysRepository.js');
const MessageBuilder = require('../../utils/messageBuilder.js');

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

			const existingBirthday = await birthdaysRepo.getOne(interaction.guildId, userId);

			if (existingBirthday) {
				await birthdaysRepo.update(
					interaction.guildId,
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
					guild_id: interaction.guildId,
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
			console.error(`[DB_SAVE_ERROR] Failed to save data for /${interaction.commandName}.`);
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