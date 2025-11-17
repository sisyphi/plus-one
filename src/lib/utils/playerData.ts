import { DAY_IN_MS, getDateInTimezone, getUserTimezone } from './datetime';

export type PlayerData = {
	totalPlayed: number;
	currStreak: number;
	bestStreak: number;
	lastPlayed: string | null;
	lastScore: number | null;
	scoreDist: Record<string, number>;
};

export const EMPTY_PLAYER_DATA: PlayerData = {
	totalPlayed: 0,
	currStreak: 0,
	bestStreak: 0,
	lastPlayed: null,
	lastScore: null,
	scoreDist: {}
};

export function resetPlayerData() {
	localStorage.setItem('playerData', JSON.stringify(EMPTY_PLAYER_DATA));
}

export function getPlayerData(): PlayerData {
	const playerDataJson = localStorage.getItem('playerData');

	return playerDataJson ? JSON.parse(playerDataJson) : EMPTY_PLAYER_DATA;
}

export function setPlayerData(data: PlayerData) {
	localStorage.setItem('playerData', JSON.stringify(data));
}

// TODO::Do it minute cryptic style where if you leave the page open and the date changes,
// it works as if you submitted it on the date you opened the page.
export function updatePlayerData(score: number): PlayerData {
	const timeZone = getUserTimezone();
	const today = getDateInTimezone(timeZone);
	const playerData = getPlayerData();

	const { lastPlayed, lastScore, scoreDist } = playerData;

	if (lastPlayed === null || lastScore === null || Object.keys(scoreDist).length === 0) {
		resetPlayerData();

		playerData.totalPlayed = 1;
		playerData.currStreak = 1;
		playerData.bestStreak = 1;
		playerData.lastPlayed = today;
		playerData.lastScore = score;
		scoreDist[score] = 1;

		setPlayerData(playerData);

		return playerData;
	}

	// CASE 2: Played today for the first time
	if (lastPlayed !== today) {
		const lastDate = new Date(lastPlayed);
		const nowDate = new Date(today);
		const diffDays = Math.floor((nowDate.getTime() - lastDate.getTime()) / DAY_IN_MS);

		if (diffDays === 1) {
			playerData.currStreak += 1;
		} else {
			playerData.currStreak = 1;
		}

		scoreDist[score] = (scoreDist[score] ?? 0) + 1;

		playerData.totalPlayed += 1;
		playerData.bestStreak = Math.max(playerData.bestStreak, playerData.currStreak);
		playerData.lastPlayed = today;
		playerData.lastScore = score;

		setPlayerData(playerData);
		return playerData;
	}

	// CASE 3: Played today already
	if (lastPlayed === today && lastScore !== null) {
		if (score > lastScore) {
			const lastScoreCount = scoreDist[lastScore] ?? 0;
			const currScoreCount = scoreDist[score] ?? 0;

			scoreDist[lastScore] = Math.max(lastScoreCount - 1, 0);
			scoreDist[score] = currScoreCount + 1;
			playerData.lastScore = score;
		}

		setPlayerData(playerData);
	}

	return playerData;
}
