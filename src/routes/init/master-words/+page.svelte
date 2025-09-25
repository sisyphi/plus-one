<!-- Fully chatgpt -->
<script lang="ts">
	let allWords: string[] = [];

	// Regex to match only letters (a-z, A-Z)
	const letterOnlyRegex = /^[a-zA-Z]+$/;

	// Regex to detect 4+ repeating letters in a row
	const fourRepeatsRegex = /(.)\1{3,}/;

	async function handleFiles(event: Event) {
		const input = event.target as HTMLInputElement;
		if (!input.files) return;

		const wordsSet = new Set<string>();

		for (const file of Array.from(input.files)) {
			const text = await file.text();
			text.split('\n').forEach((line) => {
				const word = line.trim().toLowerCase(); // convert to lowercase
				if (
					letterOnlyRegex.test(word) && // only letters
					!fourRepeatsRegex.test(word) // no 4+ repeats
				) {
					wordsSet.add(word);
				}
			});
		}

		allWords = Array.from(wordsSet).sort();
	}

	function downloadWords() {
		const blob = new Blob([allWords.join('\n')], { type: 'text/plain' });
		const url = URL.createObjectURL(blob);

		const a = document.createElement('a');
		a.href = url;
		a.download = 'combined_words.txt';
		a.click();

		URL.revokeObjectURL(url);
	}
</script>

<h2>Combine Text Files</h2>
<input type="file" multiple accept=".txt" on:change={handleFiles} />

{#if allWords.length > 0}
	<button on:click={downloadWords}>Download Combined Words</button>
{/if}
