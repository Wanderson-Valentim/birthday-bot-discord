const { GuildSettings } = require('../database.js');

async function getOrCreate(guildId) {
	return await GuildSettings.findOrCreate({
		where: { guild_id: guildId },
		defaults: { guild_id: guildId },
	});
}

async function update(guildId, propertiesToUpdate) {
	return await GuildSettings.update(
		propertiesToUpdate,
		{
			where: { guild_id: guildId },
		},
	);
}

async function getByGuilId(guildId) {
	return await GuildSettings.findOne({
		where: { guild_id: guildId },
	});
}

module.exports = {
	getOrCreate,
	update,
	getByGuilId,
};