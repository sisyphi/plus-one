<script lang="ts">
	import { ChevronDownIcon, ChevronUpIcon } from '@lucide/svelte';
	import { cn, Button, Divider, Typography, HighlightText } from 'imbento-box-ui';
	import WordListItem from './WordListItem.svelte';

	interface WordListProps {
		guess: string;
		words: string[];
		onDownClick: () => void;
		onUpClick: () => void;
		downDisabled: boolean;
		upDisabled: boolean;
		selectedIdx: number;
		onDelete: (idx: number) => void;
	}
	let {
		guess,
		words = [],
		onDownClick,
		onUpClick,
		downDisabled,
		upDisabled,
		selectedIdx,
		onDelete
	}: WordListProps = $props();

	let selectedWord = $derived(words.at(selectedIdx));
	let nextIdx = $derived(words.length - 1 - selectedIdx);
</script>

<div class={cn('flex flex-col')}>
	<div class={cn('flex flex-row items-center')}>
		<div class={cn('flex h-full flex-row items-center')}>
			<Button
				onClick={onDownClick}
				padding="icon"
				class={cn('h-full w-10')}
				disabled={downDisabled}
			>
				<ChevronDownIcon strokeWidth={4} />
			</Button>
			<Divider axis="vertical" />
		</div>
		{#if selectedWord}
			<Typography size="lg" class={cn('grow py-8 text-center font-mono')}>
				<HighlightText
					highlights={guess.split('')}
					text={selectedWord}
					baseColor="red"
					highlightColor="blue"
				/>
			</Typography>
		{/if}
		<div class={cn('flex h-full flex-row items-center')}>
			<Divider axis="vertical" />
			<Button onClick={onUpClick} padding="icon" class={cn('h-full w-10')} disabled={upDisabled}>
				<ChevronUpIcon strokeWidth={4} />
			</Button>
		</div>
	</div>
	<Divider axis="horizontal" />
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
</div>
