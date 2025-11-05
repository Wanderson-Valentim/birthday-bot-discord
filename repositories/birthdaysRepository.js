const { Op } = require('sequelize');

class BirthdaysRepository {
	constructor(birthdaysModel, sequelizeInstance) {
		this.Birthdays = birthdaysModel;
		this.sequelize = sequelizeInstance;
	}

	async getAllByGuildId(guildId) {
		return await this.Birthdays.findAll({
			where: { guild_id: guildId },
			order: [
				['month', 'ASC'],
				['day', 'ASC'],
			],
		});
	}

	async getOne(guildId, userId) {
		return await this.Birthdays.findOne({ where: { guild_id: guildId, user_id: userId } });
	}

	async create(data) {
		return await this.Birthdays.create(data);
	}

	async update(guildId, userId, propertiesToUpdate) {
		return await this.Birthdays.update(
			propertiesToUpdate,
			{
				where: { guild_id: guildId, user_id: userId },
			},
		);
	}

	async destroy(guildId, userId) {
		return await this.Birthdays.destroy({ where: { guild_id: guildId, user_id: userId } });
	}

	async getByDate(guildId, day, month) {
		return await this.Birthdays.findAll({
			where: {
				guild_id: guildId,
				day: day,
				month: month,
			},
		});
	}

	async getUpcomingByMonths(guildId, monthsToFetch) {
		const { monthFilters, hasPassedThisYear } = this.#calculateDateFilters(monthsToFetch);

		return await this.Birthdays.findAll({
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

	#calculateDateFilters(monthsToFetch) {
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

		const hasPassedThisYear = this.sequelize.literal(
			`CASE
          WHEN month < ${currentMonth} OR (month = ${currentMonth} AND day < ${currentDay})
          THEN 1
          ELSE 0
       END`,
		);

		return { monthFilters, hasPassedThisYear };
	}
}

module.exports = BirthdaysRepository;