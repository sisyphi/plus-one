<script lang="ts">
	import { loadFile } from '$lib/helper';
	import { onMount } from 'svelte';
	let words: string[] = [];
	let dataMap: Map<number, Map<string, string[]>> = new Map();
	let startingWords: string[] = [];

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
			const key: string = word.split('').sort().join('');
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

	function shuffleArray<T>(array: T[]): T[] {
		const arr = [...array];
		for (let i = arr.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[arr[i], arr[j]] = [arr[j], arr[i]];
		}
		return arr;
	}

	onMount(async () => {
		words = await loadFile('words_alpha', 'txt');
		words = words.sort();

		dataMap = createDataMap(words);
		startingWords = shuffleArray(words.filter((w) => w.length === 4));
	});
</script>

<div class="my-4 flex flex-col items-center justify-center gap-4">
	<button
		class="border-2 border-black p-2 hover:cursor-pointer"
		onclick={() => downloadMapAsJson(dataMap)}
	>
		Download plus one
	</button>
	<button
		class="border-2 border-black p-2 hover:cursor-pointer"
		onclick={() => downloadMapAsText(startingWords)}
	>
		Download starting words
	</button>
</div>
