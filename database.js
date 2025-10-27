const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

// 2. Example of importing and initializing models
// const Users = require('./models/Users.js')(sequelize, DataTypes);
// const CurrencyShop = require('./models/CurrencyShop.js')(sequelize, DataTypes);
// const UserItems = require('./models/UserItems.js')(sequelize, DataTypes);

module.exports = { sequelize };