const MessageBuilder = require('./messageBuilder');

async function handleCommandError({ interaction, error, logContext, userMessage }) {
	console.error(`[${logContext}] Failed to execute /${interaction.commandName}.`);
	console.error(`Guild: ${interaction.guild.name} (ID: ${interaction.guildId})`);
	console.error(`User: ${interaction.user.tag} (ID: ${interaction.user.id})`);
	console.error(error);

	const errorMessage = {
		embeds: MessageBuilder.error(userMessage),
		ephemeral: true,
	};

	try {
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp(errorMessage);
		}
		else {
			await interaction.reply(errorMessage);
		}
	}
	catch (replyError) {
		console.error('[REPLY_ERROR] Failed to send error message to user after initial error:', replyError);
	}
}

module.exports = { handleCommandError };