export type WordData = {
	[keyLen: number]: {
		[key: string]: string[];
	};
};

export function isOneLetterApart(wordA: string, wordB: string): boolean {
	if (wordA.length > wordB.length) {
		[wordA, wordB] = [wordB, wordA];
	}

	const lettersA = wordA.split('').toSorted();
	const lettersB = wordB.split('').toSorted();

	if (lettersB.length - lettersA.length !== 1) return false;

	let idxA = 0;
	let idxB = 0;
	let diff = 0;

	while (idxA < lettersA.length && idxB < lettersB.length) {
		if (lettersA[idxA] === lettersB[idxB]) {
			idxA++;
			idxB++;
			continue;
		}

		idxB++;
		diff++;
		if (diff > 1) return false;
	}

	return true;
}

export function isWordValid(word: string, wordData: WordData): boolean {
	word = word.toLowerCase();
	const keyMap = wordData[word.length];
	if (!keyMap) return false;
	const wordList = keyMap[wordToSignature(word)];
	if (!wordList) return false;
	return wordList.includes(word);
}

export function randElement<T>(arr: T[]): T {
	const idx = Math.floor(Math.random() * arr.length);
	return arr[idx];
}

export function wordToSignature(word: string): string {
	return word.split('').toSorted().join('');
}

export const PLUS_ONE_EPOCH_DATE = '2025-09-24';

// Fully chat-gpt
export function getDaysSinceOrigin(originStr: string, tz: string): number {
	const now = new Date();

	// ---- CASE 1: IANA timezone (e.g. "Asia/Manila") ----
	if (!/^UTC([+-]\d{1,2})(?::(\d{2}))?$/.test(tz)) {
		const fmt = new Intl.DateTimeFormat('en-CA', {
			timeZone: tz,
			year: 'numeric',
			month: '2-digit',
			day: '2-digit'
		});

		const nowParts = fmt.formatToParts(now);
		const nowY = Number(nowParts.find((p) => p.type === 'year')?.value);
		const nowM = Number(nowParts.find((p) => p.type === 'month')?.value);
		const nowD = Number(nowParts.find((p) => p.type === 'day')?.value);

		const [originY, originM, originD] = originStr.split('-').map(Number);

		const toMidnight = (y: number, m: number, d: number) => {
			const utcMidnight = new Date(Date.UTC(y, m - 1, d));

			const parts = new Intl.DateTimeFormat('en-US', {
				timeZone: tz,
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

		return Math.floor((nowMid.getTime() - originMid.getTime()) / 86_400_000);
	}

	// ---- CASE 2: Manual offset "UTC+X(:Y)" ----
	const match = tz.match(/^UTC([+-]\d{1,2})(?::(\d{2}))?$/);
	if (match) {
		const hours = parseInt(match[1], 10);
		const minutes = match[2] ? parseInt(match[2], 10) : 0;
		const offsetMinutes = hours * 60 + (hours >= 0 ? minutes : -minutes);

		const toMidnight = (y: number, m: number, d: number) => {
			return new Date(Date.UTC(y, m - 1, d) - offsetMinutes * 60 * 1000);
		};

		const [originY, originM, originD] = originStr.split('-').map(Number);

		const nowUtc = new Date();
		const nowY = nowUtc.getUTCFullYear();
		const nowM = nowUtc.getUTCMonth() + 1;
		const nowD = nowUtc.getUTCDate();

		const originMid = toMidnight(originY, originM, originD);
		const nowMid = toMidnight(nowY, nowM, nowD);

		return Math.floor((nowMid.getTime() - originMid.getTime()) / 86_400_000);
	}

	throw new Error(`Invalid timezone: ${tz}`);
}
