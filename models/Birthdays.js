module.exports = (sequelize, DataTypes) => {
	return sequelize.define(
		'birthdays',
		{
			user_id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				allowNull: false,
			},
			guild_id: {
				type: DataTypes.INTEGER,
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
			year: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
		},
		{
			timestamps: false,
		},
	);
};