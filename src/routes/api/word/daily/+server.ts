import startingWordsTxt from '$lib/data/starting_words.txt?raw';
import nilGraphJson from '$lib/data/nil_graph.json';
import { getDaysSinceOrigin, PLUS_ONE_EPOCH_DATE, wordToSignature } from '$lib/helper';
import type { RequestHandler } from '@sveltejs/kit';
import { Graph } from '$lib/datatypes/Graph';

export const GET: RequestHandler = async ({ cookies }) => {
	const tz = cookies.get('tz') ?? 'UTC+0';

	const startingWords = startingWordsTxt.replaceAll('\r', '').split('\n');

	const dailyIdx = getDaysSinceOrigin(PLUS_ONE_EPOCH_DATE, tz) % startingWords.length;
	const word: string = startingWords[dailyIdx];

	const nilGraph: Graph<string[]> = Graph.fromJSON(JSON.stringify(nilGraphJson));

	const graph: Graph<string[]> = nilGraph.getSubgraph(wordToSignature(word));

	console.log(
		`GET api/word/daily tz=${tz} dailyIdx=${dailyIdx} word=${word} sig=${wordToSignature(word)} graph=${graph.printInfo()}`
	);

	return new Response(
		JSON.stringify({
			word,
			graph: graph.toJSON()
		}),
		{
			headers: { 'Content-Type': 'application/json' }
		}
	);
};
