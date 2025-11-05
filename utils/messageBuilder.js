const { EmbedBuilder, channelMention, roleMention, userMention, codeBlock } = require('discord.js');

class MessageBuilder {
	static success(description) {
		return [
			new EmbedBuilder()
				.setColor(10867565)
				.setDescription(`✅ ${description}`),
		];
	}

	static error(description) {
		return [
			new EmbedBuilder()
				.setColor(16735067)
				.setDescription(`❌ ${description}`),
		];
	}

	static info(description) {
		return [
			new EmbedBuilder()
				.setColor(16635010)
				.setDescription(`⚠️ ${description}`),
		];
	}

	static list(title, birthdays) {
		const description = birthdays.map(bday => {
			const day = String(bday.day).padStart(2, '0');
			const month = String(bday.month).padStart(2, '0');
			const user = userMention(bday.user_id);

			return `**${day}/${month}** - ${user}`;
		}).join('\n');

		return [
			new EmbedBuilder()
				.setColor(6198012)
				.setTitle(title)
				.setDescription(description),
		];
	}

	static settings(serverName, settings) {
		const channelId = settings.notification_channel_id;
		const roleId = settings.birthday_role_id;
		const currentMessage = settings.birthday_message;

		const channel = channelId
			? channelMention(channelId)
			: '`Nenhum canal definido`';

		const role = roleId
			? roleMention(roleId)
			: '`Nenhum cargo definido`';

		const message = currentMessage
			? 'Mensagem definida! Para mais detalhes utilize' + codeBlock('/ver-mensagem')
			: '`Nenhuma mensagem definida`';

		return [
			new EmbedBuilder()
				.setColor(6198012)
				.setTitle(':gear: Configurações')
				.setDescription(` Configurações definidas atualmente do servidor **${serverName}.**`)
				.setFields(
					{
						name: 'Canal de anúncios dos aniversários',
						value: channel,
						inline: false,
					},
					{
						name: 'Cargo de Aniversariante',
						value: role,
						inline: false,
					},
					{
						name: 'Mensagem de Aniversário',
						value: message,
						inline: false,
					},
				),
		];
	}

	static message(data, userId = null) {
		const userMentionStr = userId ? userMention(userId) : null ;

		const title = data.birthday_message_title;
		const color = data.birthday_message_color || 16293187;
		let description = data.birthday_message;

		if (userMentionStr) {
			description = description.replace(/{user}/g, userMentionStr);
		}

		const embed = new EmbedBuilder()
			.setColor(color)
			.setTitle(title)
			.setDescription(description);

		if (data.birthday_message_image_url) {
			embed.setImage(data.birthday_message_image_url);
		}

		return [embed];
	}
}

module.exports = MessageBuilder;