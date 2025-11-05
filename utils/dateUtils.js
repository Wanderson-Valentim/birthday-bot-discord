const TIMEZONE = 'America/Sao_Paulo';

function getTodayString() {
	return new Date().toLocaleDateString('sv-SE', { timeZone: TIMEZONE });
}

function getYesterdayDateParts() {
	const yesterday = new Date();
	yesterday.setDate(yesterday.getDate() - 1);
	return {
		day: yesterday.getDate(),
		month: yesterday.getMonth() + 1,
	};
}

function getTodayDateParts() {
	const today = new Date();
	return {
		day: today.getDate(),
		month: today.getMonth() + 1,
	};
}

module.exports = {
	TIMEZONE,
	getTodayString,
	getYesterdayDateParts,
	getTodayDateParts,
};