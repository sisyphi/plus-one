import startingWordsTxt from '$lib/data/processed/starting_words.txt?raw';
import { Graph } from '$lib/types/Graph';
import { nilGraph } from '$lib/utils/nilGraph';
import { getDaysSinceOrigin, PLUS_ONE_EPOCH_DATE } from '$lib/utils/datetime';
import { randElement, wordToSignature } from '$lib/utils/helper';

export function getWordGraph(word: string) {
	const subGraph: Graph<string[]> = nilGraph.getSubgraph(wordToSignature(word));

	console.log(
		`getWordGraph word=${word} sig=${wordToSignature(word)} subGraph=${subGraph.printInfo()}`
	);

	return {
		word,
		graph: subGraph
	};
}

export function getDailyWordGraph(timeZone: string = 'Etc/UTC') {
	const startingWords = startingWordsTxt.replaceAll('\r', '').split('\n');
	const dailyIdx = getDaysSinceOrigin(PLUS_ONE_EPOCH_DATE, timeZone) % startingWords.length;
	const word: string = startingWords[dailyIdx];

	const subGraph: Graph<string[]> = nilGraph.getSubgraph(wordToSignature(word));

	console.log(
		`getDailyWordGraph timeZone=${timeZone} dailyIdx=${dailyIdx} word=${word} sig=${wordToSignature(
			word
		)} subGraph=${subGraph.printInfo()}`
	);

	return {
		word,
		graph: subGraph
	};
}

export function getRandomWordGraph() {
	const startingWords = startingWordsTxt.replaceAll('\r', '').split('\n');
	const word: string = randElement(startingWords);

	const subGraph: Graph<string[]> = nilGraph.getSubgraph(wordToSignature(word));

	console.log(
		`getRandomWordGraph word=${word} sig=${wordToSignature(word)} subGraph=${subGraph.printInfo()}`
	);

	return {
		word,
		graph: subGraph
	};
}
