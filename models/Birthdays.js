module.exports = (sequelize, DataTypes) => {
	return sequelize.define(
		'birthdays',
		{
			user_id: {
				type: DataTypes.STRING,
				primaryKey: true,
				allowNull: false,
			},
			guild_id: {
				type: DataTypes.STRING,
				primaryKey: true,
				allowNull: false,
			},
			day: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			month: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
		},
		{
			timestamps: false,
		},
		{
			indexes: [
				{
					name: 'guild_month_day_idx',
					fields: ['guild_id', 'month', 'day'],
				},
			],
		},
	);
};