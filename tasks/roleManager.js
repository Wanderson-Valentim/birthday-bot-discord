const cron = require('node-cron');
const { TIMEZONE, getTodayDateParts, getTodayString } = require('../utils/dateUtils');

function scheduleRoleRemoval(client) {
	cron.schedule('1 0 * * *', () => {
		console.log('[CRON] Executing daily role removal...');
		executeRoleRemoval(client);
	}, {
		scheduled: true,
		timezone: TIMEZONE,
	});
}

async function executeRoleRemoval(client) {
	const settingsRepo = client.repositories.settings;
	const birthdaysRepo = client.repositories.birthdays;
	const todayString = getTodayString();
	const todayParts = getTodayDateParts();

	for (const guild of client.guilds.cache.values()) {
		try {
			const settings = await settingsRepo.getByGuildId(guild.id);

			if (settings && settings.last_role_removal_date === todayString) {
				continue;
			}

			if (!settings || !settings.birthday_role_id) {
				continue;
			}

			const role = await guild.roles.fetch(settings.birthday_role_id).catch(() => null);
			if (!role) continue;

			await guild.members.fetch();

			const birthdaysToday = await birthdaysRepo.getByDate(guild.id, todayParts.day, todayParts.month);

			const birthdaysTodaySet = new Set(birthdaysToday.map(b => b.user_id));

			const membersWithRole = role.members;

			for (const member of membersWithRole.values()) {
				if (!birthdaysTodaySet.has(member.id)) {
					try {
						await member.roles.remove(role, 'Birthday ended or date changed');
					}
					catch (memberError) {
						console.error(`[ROLE_REMOVE_ERROR] Failed to remove role from ${member.id}`, memberError);
					}
				}
			}

			await settings.update({ last_role_removal_date: todayString });
		}
		catch (error) {
			console.error(`[ROLE_MANAGER_ERROR] Failed to process guild ${guild.name}`, error);
		}
	}
}

module.exports = { scheduleRoleRemoval, executeRoleRemoval };