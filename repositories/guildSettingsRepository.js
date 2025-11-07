class GuildSettingsRepository {
	constructor(guildSettingsModel) {
		this.GuildSettings = guildSettingsModel;
	}

	async getOrCreate(guildId) {
		return await this.GuildSettings.findOrCreate({
			where: { guild_id: guildId },
			defaults: { guild_id: guildId },
		});
	}

	async update(guildId, propertiesToUpdate) {
		return await this.GuildSettings.update(
			propertiesToUpdate,
			{
				where: { guild_id: guildId },
			},
		);
	}

	async getByGuildId(guildId) {
		return await this.GuildSettings.findOne({
			where: { guild_id: guildId },
		});
	}

	async destroy(guildId) {
		console.log(`[DB] Deleting all data for guild ${guildId}...`);
		return await this.GuildSettings.destroy({
			where: { guild_id: guildId },
		});
	}

	async getAllGuildIds() {
		const guilds = await this.GuildSettings.findAll({
			attributes: ['guild_id'],
			raw: true,
		});
		return guilds.map(g => g.guild_id);
	}
}

module.exports = GuildSettingsRepository;