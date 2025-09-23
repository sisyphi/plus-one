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

export async function loadFile(filename: string, ext: string): Promise<any> {
	const res = await fetch(`/data/${filename}.${ext}`);
	switch (ext) {
		case 'json':
			return await res.json();
		case 'txt':
			return (await res.text()).replaceAll('\r', '').split('\n');
	}
}

export function randElement<T>(arr: T[]): T {
	const idx = Math.floor(Math.random() * arr.length);
	return arr[idx];
}

export function wordToSignature(word: string): string {
	return word.split('').toSorted().join('');
}
