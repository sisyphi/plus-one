import { Graph } from '../../lib/types/Graph';

export async function saveTimezone(timeZone: string): Promise<void> {
	await fetch('/api/timeZone', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ timeZone }),
		credentials: 'same-origin'
	});
}

export async function getDailyWordData(): Promise<{ word: string; graph: Graph<string[]> }> {
	const res = await fetch('/api/word/daily');
	const { word, graph }: { word: string; graph: string } = await res.json();

	const wordGraph: Graph<string[]> = Graph.fromJSON(graph);

	return { word, graph: wordGraph };
}

export async function getRandomWordData(): Promise<{ word: string; graph: Graph<string[]> }> {
	const res = await fetch('/api/word/random');
	const { word, graph }: { word: string; graph: string } = await res.json();

	const wordGraph: Graph<string[]> = Graph.fromJSON(graph);

	return { word, graph: wordGraph };
}

export async function getWordData(w: string): Promise<{ word: string; graph: {} }> {
	const res = await fetch(`/api/word/${w}`);
	const { word, graph }: { word: string; graph: string } = await res.json();

	const wordGraph: Graph<string[]> = Graph.fromJSON(graph);

	return { word, graph: wordGraph };
}

export async function loadStaticFile(filename: string, ext: string): Promise<any> {
	const res = await fetch(`/data/${filename}.${ext}`);
	switch (ext) {
		case 'json':
			return await res.json();
		case 'txt':
			return (await res.text()).replaceAll('\r', '').split('\n');
	}
}
