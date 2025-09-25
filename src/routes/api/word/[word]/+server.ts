import nilGraphJson from '$lib/data/nil_graph.json';
import { wordToSignature } from '$lib/helper';
import type { RequestHandler } from '@sveltejs/kit';
import { Graph } from '$lib/datatypes/Graph';

export const GET: RequestHandler = async ({ params }) => {
	let { word } = params;

	word = word ?? 'test';

	const nilGraph: Graph<string[]> = Graph.fromJSON(JSON.stringify(nilGraphJson));

	const graph: Graph<string[]> = nilGraph.getSubgraph(wordToSignature(word));

	console.log(
		`GET api/word/[word] word=${word} sig=${wordToSignature(word)} graph=${graph.printInfo()}`
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
