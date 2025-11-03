const { Op } = require('sequelize');
const { Birthdays, sequelize } = require('../database.js');

async function getAllByGuildId(guildId) {
	return await Birthdays.findAll({
		where: { guild_id: guildId },
		order: [
			['month', 'ASC'],
			['day', 'ASC'],
		],
	});
}

async function getOne(guildId, userId) {
	return await Birthdays.findOne({ where: { guild_id: guildId, user_id: userId } });
}

async function create(data) {
	return await Birthdays.create(data);
}

async function update(guildId, userId, propertiesToUpdate) {
	return await Birthdays.update(
		propertiesToUpdate,
		{
			where: { guild_id: guildId, user_id: userId },
		},
	);
}

async function destroy(guildId, userId) {
	return await Birthdays.destroy({ where: { guild_id: guildId, user_id: userId } });
}

async function getUpcomingByMonths(guildId, monthsToFetch) {
	const today = new Date();
	const currentDay = today.getDate();
	const currentMonth = today.getMonth() + 1;

	const monthFilters = [];

	monthFilters.push({
		month: currentMonth,
		day: { [Op.gte]: currentDay },
	});

	let lastMonth = currentMonth;
	for (let i = 1; i < monthsToFetch; i++) {
		const nextMonth = (lastMonth % 12) + 1;
		monthFilters.push({
			month: nextMonth,
		});
		lastMonth = nextMonth;
	}

	const hasPassedThisYear = sequelize.literal(
		`CASE
        WHEN month < ${currentMonth} OR (month = ${currentMonth} AND day < ${currentDay})
        THEN 1
        ELSE 0
     END`,
	);

	return await Birthdays.findAll({
		where: {
			guild_id: guildId,
			[Op.or]: monthFilters,
		},
		order: [
			[hasPassedThisYear, 'ASC'],
			['month', 'ASC'],
			['day', 'ASC'],
		],
	});
}

module.exports = {
 	getAllByGuildId,
	getOne,
	create,
	update,
	destroy,
	getUpcomingByMonths,
};