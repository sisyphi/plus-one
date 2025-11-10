<script lang="ts">
	import { containsAllLetters, validateGuess, type GameState } from '$lib/utils/helper';
	import { SquareCheckIcon, SquareIcon, XIcon } from '@lucide/svelte';
	import { Button, cn, Divider, HighlightText, Typography } from 'imbento-box-ui';
	import { onMount } from 'svelte';
	import { loadStaticFile } from '../../routes/api';
	import { Graph } from '$lib/types/Graph';
	import GuessInput from './GuessInput.svelte';

	let graph: Graph<string[]> = $state(new Graph<string[]>());
	let answers: string[] = $state(['test']);
	let guess: string = $state('');

	interface GuidePageProps {
		appState: GameState;
	}

	let { appState = $bindable() }: GuidePageProps = $props();

	let lastAnswer = $derived(answers[answers.length - 1]);

	let isConnected = $derived(validateGuess(guess.toLowerCase(), lastAnswer || '', graph));
	let isAnagram = $derived(containsAllLetters(guess, lastAnswer));
	let isShort = $derived(guess.length < lastAnswer.length + 1);
	let isLong = $derived(guess.length > lastAnswer.length + 1);
	let isValid = $derived(isConnected && isAnagram && !isShort && !isLong);

	function handleGuessSubmit(e: SubmitEvent) {
		e.preventDefault();

		if (!isValid) return;

		answers.push(guess.toLowerCase());

		guess = '';
	}

	onMount(async () => {
		const graphJson = await loadStaticFile('test_graph', 'json');
		graph = Graph.fromJSON(graphJson);
	});

	let step1Done = $state(false);
	let step2Done = $state(false);
	let step3Done = $state(false);
	$effect(() => {
		if (!isShort && !isLong) step1Done = true;
		if (isAnagram) step2Done = true;
		if (isValid) step3Done = true;
	});
</script>

<div class="flex flex-row items-center">
	<Typography class="flex-1 px-4 py-2" align="left">how to play?</Typography>
	<Button class="m-2 w-8" onClick={() => (appState = 'menu')} padding="icon">
		<XIcon strokeWidth={4} />
	</Button>
</div>
<Divider axis="horizontal" />

<ul class="m-4 flex h-full list-disc flex-col gap-4 px-8">
	<li>
		<Typography class="pl-2" size="sm" align="left">Start with today's 4 letter word</Typography>
		<Typography size="xl" class={cn('py-2 text-center font-mono')}>
			<HighlightText
				highlights={guess.toLowerCase().split('')}
				text={lastAnswer}
				baseColor="lightGrey"
				highlightColor="black"
			/>
		</Typography>
	</li>
	<li>
		<Typography class="pl-2" size="sm" align="left">
			Find a word that fits these THREE rules
		</Typography>
		<div class="py-2">
			<Divider axis="horizontal" />
			<div class="flex h-16 flex-row">
				<Divider axis="vertical" />
				<Typography
					class={cn(
						'h-full flex-1 place-content-center self-center bg-red leading-5',
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
						'h-full flex-1 place-content-center self-center bg-red leading-5',
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
						'h-full flex-1 place-content-center self-center bg-red leading-5',
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
				<Divider axis="vertical" />
			</div>
			<Divider axis="horizontal" />
		</div>
		<GuessInput bind:guess handleSubmit={handleGuessSubmit} />
		<Typography size="xs">Try out STATE to see what happens</Typography>
	</li>
	<li>
		<Typography class="pl-2" size="sm" align="left">Press ENTER to send your answer</Typography>
	</li>
	<li>
		<Typography class="pl-2" size="sm" align="left">
			Keep going until you can't find a new word and submit your game
		</Typography>
		<div class="flex flex-row items-center justify-center py-2">
			<Button
				class={cn(
					'border-4 border-black hover:bg-black hover:**:text-white',
					answers.length <= 1 && 'hover:bg-dark-grey hover:**:text-black'
				)}
				onClick={() => {}}
				disabled={answers.length <= 1}
			>
				<Typography>submit game</Typography>
			</Button>
		</div>
	</li>
	<li>
		<Typography class="pl-2" size="sm" align="left">
			The longer your word gets, the higher your score
		</Typography>
	</li>
</ul>
