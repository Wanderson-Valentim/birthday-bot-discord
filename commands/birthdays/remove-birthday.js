const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const birthdaysRepo = require('../../repositories/birthdaysRepository.js');

module.exports = {
	data: new SlashCommandBuilder().setName('remover-aniversario')
		.setDescription('Remove o aniversário de um membro.')
		.addUserOption((option) => option.setName('aniversariante')
			.setDescription('O membro cujo aniversário será removido.')
			.setRequired(true)),

	async execute(interaction) {
		try {
			const user = interaction.options.getUser('aniversariante');

			const itWasRemoved = await birthdaysRepo.destroy(interaction.guildId, String(user.id));

			if (!itWasRemoved) {
				await interaction.reply({
					content: `⚠️ O aniversário de ${user} não estava registrado.`,
					flags: MessageFlags.Ephemeral,
				});
				return;
			}

			await interaction.reply({
				content: `✅ O aniversário de ${user} foi removido com sucesso.`,
				flags: MessageFlags.Ephemeral,
			});
		}
		catch (error) {
			console.error(`[DB_SAVE_ERROR] Failed to save data for /${interaction.commandName}.`);
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