module.exports = (sequelize, DataTypes) => {
	return sequelize.define(
		'guild_settings',
		{
			guild_id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				allowNull: false,
			},
			notification_channel_id: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			birthday_role_id: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			birthday_message: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
		},
		{
			timestamps: false,
		},
	);
};