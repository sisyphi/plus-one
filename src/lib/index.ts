import { Graph } from './datatypes/Graph';

export async function fetchWordData(): Promise<{ word: string; graph: Graph<string[]> }> {
	const res = await fetch('/api/word');
	const { word, graph }: { word: string; graph: string } = await res.json();

	const wordGraph: Graph<string[]> = Graph.fromJSON(graph);

	return { word, graph: wordGraph };
}

export async function loadFile(filename: string, ext: string): Promise<any> {
	const res = await fetch(`/data/${filename}.${ext}`);
	switch (ext) {
		case 'json':
			return await res.json();
		case 'txt':
			return (await res.text()).replaceAll('\r', '').split('\n');
	}
}
