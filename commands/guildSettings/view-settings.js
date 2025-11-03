const { SlashCommandBuilder, MessageFlags, EmbedBuilder, channelMention, roleMention } = require('discord.js');
const guildSettingsRepo = require('../../repositories/guildSettingsRepository.js');

module.exports = {
	data: new SlashCommandBuilder().setName('ver-configuracoes')
		.setDescription('Exibe as configurações atuais do servidor.'),

	async execute(interaction) {
		try {
			const guildSettings = await guildSettingsRepo.getByGuilId(
				interaction.guildId,
			);

			const channelId = guildSettings.notification_channel_id;
			const roleId = guildSettings.birthday_role_id;

			const channel = channelId
				? channelMention(channelId)
				: '`Nenhum canal definido`';

			const role = roleId
				? roleMention(roleId)
				: '`Nenhum cargo definido`';

			const message = guildSettings.birthday_message
				? `\`\`\`${guildSettings.birthday_message}\`\`\``
				: '`Nenhuma mensagem definida`';

			const embed = new EmbedBuilder()
				.setTitle('⚙️ Configurações de Aniversário')
				.setDescription(`Estas são as configurações atuais para o servidor **${interaction.guild.name}**.`)
				.setColor(0x0099FF)
				.addFields(
					{ name: 'Canal de Anúncios', value: channel, inline: true },
					{ name: 'Cargo de Aniversariante', value: role, inline: true },
					{ name: 'Mensagem de Aniversário', value: message, inline: false },
				);

			await interaction.reply({
				embeds: [embed],
				flags: MessageFlags.Ephemeral,
			});
		}
		catch (error) {
			console.error(`[DB_SAVE_ERROR] Failed to fetch settings for /${interaction.commandName}.`);
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