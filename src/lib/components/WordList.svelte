<script lang="ts">
	import { Divider } from 'imbento-box-ui';
	import WordListItem from './WordListItem.svelte';

	interface WordListProps {
		words: string[];
		selectedIdx: number;
		onDelete: (idx: number) => void;
	}
	let { words = [], selectedIdx, onDelete }: WordListProps = $props();

	let nextIdx = $derived(words.length - 1 - selectedIdx);
</script>

{#if words.length}
	{#each [...words].reverse() as text, idx}
		<WordListItem
			{text}
			idx={words.length - idx}
			highlight={nextIdx === idx + 1}
			onDelete={() => onDelete(words.length - 1 - idx)}
			removeDelete={idx === words.length - 1}
		/>
		<Divider axis="horizontal" />
	{/each}
{/if}
