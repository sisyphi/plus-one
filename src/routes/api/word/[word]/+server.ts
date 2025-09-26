import { wordToSignature } from '$lib/helper';
import type { RequestHandler } from '@sveltejs/kit';
import { Graph } from '$lib/datatypes/Graph';
import { nilGraph } from '$lib/NilGraph';

export const GET: RequestHandler = async ({ params }) => {
	let { word } = params;

	word = word ?? 'test';

	const subGraph: Graph<string[]> = nilGraph.getSubgraph(wordToSignature(word));

	console.log(
		`GET api/word/[word] word=${word} sig=${wordToSignature(word)} subGraph=${subGraph.printInfo()}`
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
