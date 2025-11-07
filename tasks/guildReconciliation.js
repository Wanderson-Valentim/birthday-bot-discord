async function reconcileGuilds(client) {
	console.log('[RECONCILE] Checking for obsolete guild data...');
	const settingsRepo = client.repositories.settings;

	try {
		const discordGuildIds = new Set(client.guilds.cache.keys());

		const dbGuildIds = await settingsRepo.getAllGuildIds();

		const obsoleteGuildIds = dbGuildIds.filter(id => !discordGuildIds.has(id));

		if (obsoleteGuildIds.length > 0) {
			console.log(`[RECONCILE] Found ${obsoleteGuildIds.length} obsolete guild(s) (kicked while offline).`);

			for (const guildId of obsoleteGuildIds) {
				await settingsRepo.destroy(guildId);
				console.log(`[RECONCILE] Pruned data for obsolete guild: ${guildId}`);
			}
		}
		else {
			console.log('[RECONCILE] Database is in sync with Discord guilds. No obsolete found.');
		}
	}
	catch (error) {
		console.error('[RECONCILE_ERROR] Failed to reconcile guilds:', error);
	}
}

module.exports = { reconcileGuilds };