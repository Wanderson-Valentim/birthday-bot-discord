const MessageBuilder = require('./messageBuilder');

async function announceBirthday(guild, member, settings) {
	try {
		const [channel, role] = await Promise.all([
			guild.channels.fetch(settings.notification_channel_id),
			guild.roles.fetch(settings.birthday_role_id),
		]);

		if (!channel) {
			console.error(`[ANNOUNCE_ERROR] Canal ${settings.notification_channel_id} não encontrado no servidor ${guild.name}.`);
			return;
		}

		const embeds = MessageBuilder.message(settings, member.id);
		const content = settings.birthday_mention_everyone ? '@everyone' : null;

		await channel.send({
			content: content,
			embeds: embeds,
			allowedMentions: {
				users: [member.id],
				everyone: settings.birthday_mention_everyone,
			},
		});

		if (role && member) {
			await member.roles.add(role, 'Aniversário');
		}
	}
	catch (error) {
		console.error(`[ANNOUNCE_ERROR] Falha ao anunciar para ${member.id} em ${guild.name}`, error);
		throw error;
	}
}

module.exports = { announceBirthday };