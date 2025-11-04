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
}

module.exports = GuildSettingsRepository;