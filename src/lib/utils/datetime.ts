export const PLUS_ONE_EPOCH_DATE = '2025-10-06';
export const DAY_IN_MS = 86_400_000;

// Get the user's local timezone (IANA format)
export function getUserTimezone() {
	return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

// Get current date (YYYY-MM-DD) in a specific timezone
export function getDateInTimezone(timeZone: string): string {
	const fmt = new Intl.DateTimeFormat('en-CA', {
		timeZone,
		year: 'numeric',
		month: '2-digit',
		day: '2-digit'
	});
	return fmt.format(new Date()); // e.g. "2025-11-02"
}

// Fully chat-gpt
export function getDaysSinceOrigin(originStr: string, timeZone: string): number {
	const now = new Date();

	// ---- Only supports IANA timezone (e.g. "Asia/Manila") ----
	const fmt = new Intl.DateTimeFormat('en-CA', {
		timeZone,
		year: 'numeric',
		month: '2-digit',
		day: '2-digit'
	});

	// Extract the current date in the target timezone
	const nowParts = fmt.formatToParts(now);
	const nowY = Number(nowParts.find((p) => p.type === 'year')?.value);
	const nowM = Number(nowParts.find((p) => p.type === 'month')?.value);
	const nowD = Number(nowParts.find((p) => p.type === 'day')?.value);

	const [originY, originM, originD] = originStr.split('-').map(Number);

	// Convert to "midnight in that timezone"
	const toMidnight = (y: number, m: number, d: number) => {
		const utcMidnight = new Date(Date.UTC(y, m - 1, d));

		const parts = new Intl.DateTimeFormat('en-US', {
			timeZone,
			hour12: false,
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit'
		}).formatToParts(utcMidnight);

		const h = Number(parts.find((p) => p.type === 'hour')?.value ?? 0);
		const m2 = Number(parts.find((p) => p.type === 'minute')?.value ?? 0);

		const offsetMinutes = -(h * 60 + m2);

		return new Date(Date.UTC(y, m - 1, d) + offsetMinutes * 60 * 1000);
	};

	const originMid = toMidnight(originY, originM, originD);
	const nowMid = toMidnight(nowY, nowM, nowD);

	return Math.floor((nowMid.getTime() - originMid.getTime()) / DAY_IN_MS);
}
