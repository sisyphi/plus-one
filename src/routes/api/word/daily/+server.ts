import startingWordsTxt from '$lib/data/processed/starting_words.txt?raw';
import { wordToSignature } from '$lib/utils/helper';
import type { RequestHandler } from '@sveltejs/kit';
import { Graph } from '$lib/types/Graph';
import { nilGraph } from '$lib/utils/nilGraph';
import { getDaysSinceOrigin, PLUS_ONE_EPOCH_DATE } from '$lib/utils/datetime';

export const GET: RequestHandler = async ({ cookies }) => {
	const timeZone = cookies.get('timeZone') || 'Etc/UTC';

	const startingWords = startingWordsTxt.replaceAll('\r', '').split('\n');

	const dailyIdx = getDaysSinceOrigin(PLUS_ONE_EPOCH_DATE, timeZone) % startingWords.length;
	const word: string = startingWords[dailyIdx];

	const subGraph: Graph<string[]> = nilGraph.getSubgraph(wordToSignature(word));

	console.log(
		`GET api/word/daily timeZone=${timeZone} dailyIdx=${dailyIdx} word=${word} sig=${wordToSignature(word)} subGraph=${subGraph.printInfo()}`
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
