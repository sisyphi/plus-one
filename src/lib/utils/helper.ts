export type WordData = {
	[keyLen: number]: {
		[key: string]: string[];
	};
};

export type GameState = 'menu' | 'game' | 'success' | 'guide';

export function leadingZero(num: number, size: number): string {
	return String(num).padStart(size, '0');
}

export function containsAllLetters(wordA: string, wordB: string): boolean {
	if (!wordA || !wordB) return false;

	const a = wordA.toLowerCase().split('');
	const b = wordB.toLowerCase().split('');

	for (const char of b) {
		const index = a.indexOf(char);
		if (index === -1) return false;
		a.splice(index, 1);
	}

	return true;
}

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
