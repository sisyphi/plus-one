import startingWordsTxt from '$lib/data/starting_words.txt?raw';
import nilGraphJson from '$lib/data/nil_graph.json';
import { randElement, wordToSignature } from '$lib/helper';
import type { RequestHandler } from '@sveltejs/kit';
import { Graph } from '$lib/datatypes/Graph';

export const GET: RequestHandler = async () => {
	const startingWords = startingWordsTxt.replaceAll('\r', '').split('\n');
	const word: string = randElement(startingWords);

	const nilGraph: Graph<string[]> = Graph.fromJSON(JSON.stringify(nilGraphJson));

	const graph: Graph<string[]> = nilGraph.getSubgraph(wordToSignature(word));

	console.log(`GET api/word/random word=${word} graph=${graph.printInfo()}`);

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
