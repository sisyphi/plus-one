import startingWordsTxt from '$lib/data/processed/starting_words.txt?raw';
import { randElement, wordToSignature } from '$lib/utils/helper';
import type { RequestHandler } from '@sveltejs/kit';
import { Graph } from '$lib/types/Graph';
import { nilGraph } from '$lib/utils/nilGraph';

export const GET: RequestHandler = async () => {
	const startingWords = startingWordsTxt.replaceAll('\r', '').split('\n');
	const word: string = randElement(startingWords);

	const subGraph: Graph<string[]> = nilGraph.getSubgraph(wordToSignature(word));

	console.log(
		`GET api/word/random word=${word} sig=${wordToSignature(word)} subGraph=${subGraph.printInfo()}`
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
