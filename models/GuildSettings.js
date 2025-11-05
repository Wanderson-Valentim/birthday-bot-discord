module.exports = (sequelize, DataTypes) => {
	return sequelize.define(
		'guild_settings',
		{
			guild_id: {
				type: DataTypes.STRING,
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
			birthday_message_title: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			birthday_message_color: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			birthday_message_image_url: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			birthday_message: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			birthday_mention_everyone: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
				allowNull: false,
			},
		},
		{
			timestamps: false,
		},
	);
};