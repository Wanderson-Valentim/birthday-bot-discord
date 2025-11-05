const { Events } = require('discord.js');
const { scheduleBirthdayCheck, executeBirthdayCheck } = require('../tasks/birthdayCheck');
const { scheduleRoleRemoval, executeRoleRemoval } = require('../tasks/roleManager');

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);

		console.log('[CLIENT_READY] Running reconciliation tasks...');
		await Promise.all([
			executeBirthdayCheck(client),
			executeRoleRemoval(client),
		]);
		console.log('[CLIENT_READY] Reconciliation complete.');

		scheduleBirthdayCheck(client);
		scheduleRoleRemoval(client);
	},
};