const { SlashCommandBuilder, EmbedBuilder, userMention, MessageFlags } = require('discord.js');
const birthdaysRepo = require('../../repositories/birthdaysRepository.js');

module.exports = {
	data: new SlashCommandBuilder().setName('proximos-aniversarios')
		.setDescription('Lista os aniversários que ocorrerão nos próximos 3 meses.'),
	async execute(interaction) {
		try {
			const monthsToFetch = 3;
			const upcoming = await birthdaysRepo.getUpcomingByMonths(interaction.guildId, monthsToFetch);

			if (upcoming.length === 0) {
				await interaction.reply({
					content: `Não há aniversários cadastrados nos próximos ${monthsToFetch} meses.`,
					flags: MessageFlags.Ephemeral,
				});
				return;
			}

			const description = upcoming.map(bday => {
				const day = String(bday.day).padStart(2, '0');
				const month = String(bday.month).padStart(2, '0');
				const user = userMention(bday.user_id);
				console.log(bday, user);
				return `**${day}/${month}** - ${user}`;
			}).join('\n');

			const embed = new EmbedBuilder()
				.setTitle(`🎉 Próximos Aniversários (${monthsToFetch} Meses)`)
				.setDescription(description)
				.setColor(0x0099FF)
				.setFooter({ text: `Hoje é dia: ${new Date().toLocaleDateString('pt-BR')}` });

			await interaction.reply({ embeds: [embed] });
		}
		catch (error) {
			console.error(`[DB_SAVE_ERROR] Failed to fetch data for /${interaction.commandName}.`);
			console.error(`Guild: ${interaction.guild.name} (ID: ${interaction.guildId})`);
			console.error(error);

			const errorMessage = {
				content: '❌ Ocorreu um erro ao tentar buscar informações. Por favor, tente novamente.',
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