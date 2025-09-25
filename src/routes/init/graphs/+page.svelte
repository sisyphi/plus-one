<script lang="ts">
	import { loadStaticFile } from '$lib';
	import { Graph } from '$lib/datatypes/Graph';
	import { wordToSignature } from '$lib/helper';
	import { onMount } from 'svelte';
	let words: string[] = [];
	let dataMap: Map<number, Map<string, string[]>> = new Map();
	let startingWords: string[] = [];
	let graph: Graph<string[]>;

	function mapToJson(map: Map<any, any>): any {
		const obj: Record<string, any> = {};
		for (const [key, value] of map.entries()) {
			if (value instanceof Map) {
				obj[key] = mapToJson(value);
			} else {
				obj[key] = value;
			}
		}
		return obj;
	}

	function downloadMapAsJson(d: Map<any, any>) {
		const content = JSON.stringify(mapToJson(d), null, 2);

		const blob = new Blob([content], { type: 'application/json' });
		const url = URL.createObjectURL(blob);

		const a = document.createElement('a');
		a.href = url;
		a.download = 'plus_one.json';
		a.click();

		URL.revokeObjectURL(url);
	}

	function downloadJsonStrAsJson(json: string, filename: string) {
		const blob = new Blob([json], { type: 'application/json' });
		const url = URL.createObjectURL(blob);

		const a = document.createElement('a');
		a.href = url;
		a.download = filename + '.json';
		a.click();

		URL.revokeObjectURL(url);
	}

	function downloadMapAsText(d: string[]) {
		const content = d.join('\n');

		const blob = new Blob([content], { type: 'text/plain' });
		const url = URL.createObjectURL(blob);

		const a = document.createElement('a');
		a.href = url;
		a.download = 'starting_words.txt';
		a.click();

		URL.revokeObjectURL(url);
	}

	function createDataMap(words: string[]) {
		// Data layout: <Key length, <Key, Word list>>
		let dataMap: Map<number, Map<string, string[]>> = new Map();

		for (let word of words) {
			const key: string = wordToSignature(word);
			const keyLen = key.length;

			let keyLenMap = dataMap.get(keyLen);
			if (!keyLenMap) {
				keyLenMap = new Map();
				dataMap.set(keyLen, keyLenMap);
			}

			let keyMap = keyLenMap.get(key);
			if (!keyMap) {
				keyMap = [];
				keyLenMap.set(key, keyMap);
			}
			keyMap.push(word);
		}
		return dataMap;
	}

	function createGraph(words: string[]): Graph<string[]> {
		const graph = new Graph<string[]>();
		for (let word of words) {
			const sig = wordToSignature(word);
			let vertexData = graph.getVertexData(sig);
			if (!vertexData) {
				graph.addVertex(sig, [word]);
			} else {
				graph.updateVertex(sig, [word, ...vertexData].toSorted());
			}
		}

		const vertexIds = graph.getVertexIds();
		for (let vertexId of vertexIds) {
			const to = vertexId;
			for (let i = 0; i < vertexId.length; i++) {
				const from = vertexId.slice(0, i) + vertexId.slice(i + 1);

				if (!graph.getVertexData(from)) {
					continue;
				}

				graph.addEdge(from, to);
			}
		}
		return graph;
	}

	function shuffleArray<T>(array: T[]): T[] {
		const arr = [...array];
		for (let i = arr.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[arr[i], arr[j]] = [arr[j], arr[i]];
		}
		return arr;
	}

	onMount(async () => {
		words = await loadStaticFile('combined_words', 'txt');
		words = words.toSorted();

		dataMap = createDataMap(words);
		startingWords = shuffleArray(words.filter((w) => w.length === 4));

		graph = createGraph(words);
	});
</script>

<div class="my-4 flex flex-col items-center justify-center gap-4">
	<button
		class="border-2 border-black p-2 hover:cursor-pointer"
		onclick={() => downloadMapAsText(startingWords)}
	>
		Download starting words
	</button>
	<button
		class="border-2 border-black p-2 hover:cursor-pointer"
		onclick={() => downloadJsonStrAsJson(graph.getSubgraph('').toJSON(), 'nil_graph')}
	>
		Download graph
	</button>
</div>
