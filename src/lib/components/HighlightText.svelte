<script lang="ts">
	type HighlightChar = { char: string; isHighlight: boolean };

	type HighlightTextProps = {
		text: string;
		highlights: string[];
	};

	const { highlights, text }: HighlightTextProps = $props();

	let renderedText: HighlightChar[] = $derived.by(() => {
		let remaining = [...highlights];

		return text.split('').map((char): HighlightChar => {
			const idx = remaining.indexOf(char);

			if (idx !== -1) {
				remaining.splice(idx, 1);
				return { char, isHighlight: true };
			}

			return { char, isHighlight: false };
		});
	});
</script>

<div class="flex flex-row items-center justify-center">
	{#each renderedText as { char, isHighlight }}
		<span class={isHighlight ? 'text-blue-500' : 'text-red-500'}>{char}</span>
	{/each}
</div>
