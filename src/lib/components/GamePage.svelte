<script lang="ts">
	import { Divider, Button, Typography, cn, HighlightText } from 'imbento-box-ui';
	import GuessInput from './GuessInput.svelte';
	import { containsAllLetters, validateGuess } from '$lib/utils/helper';
	import type { Graph } from '$lib/types/Graph';
	import WordList from './WordList.svelte';
	import { ChevronDownIcon, ChevronUpIcon } from '@lucide/svelte';

	interface GamePageProps {
		guess: string;
		answers: string[];
		validationGraph: Graph<string[]>;
		selectedIdx: number;
		handleGameSubmit: () => void;
	}

	let {
		guess = $bindable(),
		answers = $bindable(),
		selectedIdx = $bindable(),
		validationGraph,
		handleGameSubmit
	}: GamePageProps = $props();

	let showWordlist = $state(true);

	let nextLength = $derived(selectedIdx + 5);

	let isConnected = $derived(
		validateGuess(guess.toLowerCase(), answers[selectedIdx] || '', validationGraph)
	);
	let isAnagram = $derived(containsAllLetters(guess, answers[selectedIdx]));
	let isShort = $derived(guess.length < nextLength);
	let isLong = $derived(guess.length > nextLength);
	let isValid = $derived(isConnected && isAnagram && !isShort && !isLong);

	function handleDelete(idx: number) {
		answers.splice(idx);
		selectedIdx = answers.length - 1;
	}

	function handleGuessSubmit(e: SubmitEvent) {
		e.preventDefault();

		if (!isValid) return;

		if (selectedIdx === answers.length - 1) {
			answers.push(guess.toLowerCase());
			selectedIdx = answers.length - 1;
		} else {
			answers.splice(selectedIdx + 1);
			answers.push(guess.toLowerCase());
			selectedIdx = answers.length - 1;
		}

		guess = '';
	}

	let selectedWord = $derived(answers[selectedIdx]);
</script>

<div class="flex h-fit flex-row">
	<Typography
		class={cn(
			'h-full flex-1 place-content-center self-center bg-red py-2 leading-5',
			!isShort && !isLong && 'bg-green'
		)}
		color="white"
	>
		{#if isShort}
			too short
		{:else if isLong}
			too long
		{:else}
			correct<br />length
		{/if}
	</Typography>
	<Divider axis="vertical" />
	<Typography
		class={cn(
			'h-full flex-1 place-content-center self-center bg-red py-2 leading-5',
			isAnagram && 'bg-green'
		)}
		color="white"
	>
		{#if !isAnagram}
			missing<br />letters
		{:else}
			complete<br />letters
		{/if}
	</Typography>
	<Divider axis="vertical" />
	<Typography
		class={cn(
			'h-full flex-1 place-content-center self-center bg-red py-2 leading-5',
			isConnected && 'bg-green'
		)}
		color="white"
	>
		{#if !isConnected}
			invalid<br />word
		{:else}
			valid<br />word
		{/if}
	</Typography>
</div>
<Divider axis="horizontal" />

<div class={cn('flex flex-row items-baseline justify-center')}>
	{#if selectedWord}
		<Typography size="xl" class={cn('pt-4 pb-2 text-center font-mono')}>
			<HighlightText
				highlights={guess.toLowerCase().split('')}
				text={selectedWord}
				baseColor="lightGrey"
				highlightColor="black"
			/>
		</Typography>
	{/if}
</div>

<div class={cn('flex flex-row items-center justify-between')}>
	<Typography class="size-10 place-content-center">{nextLength}</Typography>
	<GuessInput bind:guess handleSubmit={handleGuessSubmit} />
	<Button class="size-10" onClick={() => (showWordlist = !showWordlist)} padding="icon">
		{#if showWordlist}
			<ChevronUpIcon strokeWidth={4} />
		{:else}
			<ChevronDownIcon strokeWidth={4} />
		{/if}
	</Button>
</div>
<Divider axis="horizontal" />

<div class={cn(!showWordlist && 'hidden')}>
	<WordList words={answers} {selectedIdx} onDelete={handleDelete} />
</div>

<Button
	class={cn(
		'hover:bg-black hover:**:text-white',
		answers.length <= 1 && 'hover:bg-dark-grey hover:**:text-black'
	)}
	onClick={handleGameSubmit}
	disabled={answers.length <= 1}
>
	<Typography>submit game</Typography>
</Button>
<Divider axis="horizontal" />
