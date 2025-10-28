const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: './database/database.sqlite',
});

const Birthdays = require('./models/Birthdays.js')(sequelize, DataTypes);
const GuildSettings = require('./models/GuildSettings.js')(sequelize, DataTypes);

GuildSettings.hasMany(Birthdays, {
	foreignKey: 'guild_id',
	onDelete: 'CASCADE',
});


Birthdays.belongsTo(GuildSettings, {
	foreignKey: 'guild_id',
});

module.exports = { sequelize, Birthdays, GuildSettings };