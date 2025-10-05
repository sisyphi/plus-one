import startingWordsTxt from '$lib/data/starting_words.txt?raw';
import realWordsTxt from '$lib/data/real_words.txt?raw';
import masterWordsTxt from '$lib/data/master_words.txt?raw';
import {
	getDaysSinceOrigin,
	PLUS_ONE_EPOCH_DATE,
	shuffleArray,
	wordToSignature
} from '$lib/helper';
import type { RequestHandler } from '@sveltejs/kit';
import { Graph } from '$lib/datatypes/Graph';
import { nilGraph } from '$lib/NilGraph';

export const GET: RequestHandler = async ({ cookies }) => {
	const tz = cookies.get('tz') ?? 'UTC+0';

	const startingWords = startingWordsTxt.replaceAll('\r', '').split('\n');

	const dailyIdx = getDaysSinceOrigin(PLUS_ONE_EPOCH_DATE, tz) % startingWords.length;
	const word: string = startingWords[dailyIdx];

	const subGraph: Graph<string[]> = nilGraph.getSubgraph(wordToSignature(word));

	const fourLenWords = realWordsTxt.replaceAll('\r', '').split('\n');

	// console.log(shuffleArray(fourLenWords).join(','));

	const wordsAbove: Array<string> = [];
	startingWords.forEach((w) => {
		const sub = nilGraph.getSubgraph(wordToSignature(w));
		const v = sub.getVertexIds().length;
		console.log(w, v);
		if (v > 1000) wordsAbove.push(w);
	});

	// const fourLenWords = masterWordsTxt
	// 	.replaceAll('\r', '')
	// 	.split('\n')
	// 	.filter((mw) => mw.length === 4);

	// const fourLenSig = [...new Set(fourLenWords.map((flw) => wordToSignature(flw)))].filter((fls) => {
	// 	const vert = nilGraph.getVertexData(wordToSignature(fls));
	// 	return vert !== undefined;
	// });

	// const validSigs = fourLenSig.filter((sig) => nilGraph.getSubgraphVertexIds(sig).length > 1000);

	// validSigs.forEach((sig) =>
	// 	console.log(`TODO::valid: sig=${sig} words=${nilGraph.getVertexData(wordToSignature(sig))}`)
	// );

	// let validWords: string[] = [];
	// validSigs.forEach((sig) => {
	// 	const verts = nilGraph.getVertexData(wordToSignature(sig));
	// 	if (verts !== undefined) {
	// 		validWords = [...validWords, ...verts];
	// 	}
	// });

	// async function isRealWord(word: string, retries = 3): Promise<boolean> {
	// 	const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`;

	// 	try {
	// 		const res = await fetch(url);

	// 		if (res.status === 404) return false;
	// 		if (res.status === 429) {
	// 			// Rate limited — wait longer and retry
	// 			console.warn(`Rate limited on "${word}". Waiting 5s before retry...`);
	// 			await new Promise((r) => setTimeout(r, 5000));
	// 			if (retries > 0) return isRealWord(word, retries - 1);
	// 			return false;
	// 		}

	// 		if (!res.ok) throw new Error(`HTTP error ${res.status}`);

	// 		const data = await res.json();
	// 		return Array.isArray(data);
	// 	} catch (err) {
	// 		if (retries > 0) {
	// 			await new Promise((r) => setTimeout(r, 1000));
	// 			return isRealWord(word, retries - 1);
	// 		}
	// 		console.error(`Failed to fetch word "${word}":`, err);
	// 		return false;
	// 	}
	// }

	// async function processInBatches(
	// 	words: string[],
	// 	batchSize = 3,
	// 	delayMs = 1500
	// ): Promise<string[]> {
	// 	const valid: string[] = [];

	// 	for (let i = 0; i < words.length; i += batchSize) {
	// 		const batch = words.slice(i, i + batchSize);
	// 		console.log(
	// 			`Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(words.length / batchSize)}`
	// 		);

	// 		const results = await Promise.all(
	// 			batch.map(async (word) => ({
	// 				word,
	// 				exists: await isRealWord(word)
	// 			}))
	// 		);

	// 		for (const { word, exists } of results) {
	// 			if (exists) valid.push(word);
	// 		}

	// 		await new Promise((r) => setTimeout(r, delayMs)); // throttle
	// 	}

	// 	return valid;
	// }

	// const realWords = await processInBatches(validWords, 4, 2000);
	// await fs.writeFile('real_words.txt', realWords.join('\n'), 'utf8');

	console.log(
		`GET api/word/daily tz=${tz} dailyIdx=${dailyIdx} word=${word} sig=${wordToSignature(word)} subGraph=${subGraph.printInfo()}`
	);

	const graph = subGraph.toJSON();

	return new Response(
		JSON.stringify({
			word,
			graph
		}),
		{
			headers: { 'Content-Type': 'application/json' }
		}
	);
};
