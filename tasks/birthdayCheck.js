const cron = require('node-cron');
const { TIMEZONE, getTodayString } = require('../utils/dateUtils');
const { announceBirthday } = require('../utils/announcer');

function scheduleBirthdayCheck(client) {
	cron.schedule('0 9 * * *', () => {
		console.log('[CRON] Executing daily birthday check...');
		executeBirthdayCheck(client);
	}, {
		scheduled: true,
		timezone: TIMEZONE,
	});
}

async function executeBirthdayCheck(client) {
	const settingsRepo = client.repositories.settings;
	const birthdaysRepo = client.repositories.birthdays;

	const todayString = getTodayString();
	const today = new Date();
	const day = today.getDate();
	const month = today.getMonth() + 1;

	for (const guild of client.guilds.cache.values()) {
		try {
			const settings = await settingsRepo.getByGuildId(guild.id);

			if (settings && settings.last_announcement_date === todayString) {
				continue;
			}

			if (!settings || !settings.notification_channel_id) {
				continue;
			}

			const birthdaysToday = await birthdaysRepo.getByDate(guild.id, day, month);

			if (birthdaysToday.length === 0) {
				continue;
			}

			for (const birthday of birthdaysToday) {
				try {
					const member = await guild.members.fetch(birthday.user_id);

					if (member) {
						await announceBirthday(guild, member, settings);
					}
				}
				catch (userError) {
					console.error(`[CHECK_USER_ERROR] Falha ao processar ${birthday.user_id} em ${guild.name}`, userError);
				}
			}

			await settings.update({ last_announcement_date: todayString });
		}
		catch (error) {
			console.error(`[CHECK_ERROR] Failed to process guild ${guild.name} (ID: ${guild.id})`, error);
		}
	}
}

module.exports = { scheduleBirthdayCheck, executeBirthdayCheck };