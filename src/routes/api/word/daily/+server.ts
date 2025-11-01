import startingWordsTxt from '$lib/data/processed/starting_words.txt?raw';
import { getDaysSinceOrigin, PLUS_ONE_EPOCH_DATE, wordToSignature } from '$lib/utils/helper';
import type { RequestHandler } from '@sveltejs/kit';
import { Graph } from '$lib/types/Graph';
import { nilGraph } from '$lib/utils/nilGraph';

export const GET: RequestHandler = async ({ cookies }) => {
	const tz = cookies.get('tz') ?? 'UTC+0';

	const startingWords = startingWordsTxt.replaceAll('\r', '').split('\n');

	const dailyIdx = getDaysSinceOrigin(PLUS_ONE_EPOCH_DATE, tz) % startingWords.length;
	const word: string = startingWords[dailyIdx];

	const subGraph: Graph<string[]> = nilGraph.getSubgraph(wordToSignature(word));

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
