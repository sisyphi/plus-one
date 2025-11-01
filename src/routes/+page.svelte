<script lang="ts">
	import { getDailyWordData, saveTimezone } from '$lib/utils/routes';
	import GuessInput from '$lib/components/GuessInput.svelte';
	import WordList from '$lib/components/WordList.svelte';
	import { Graph } from '$lib/types/Graph';
	import { wordToSignature } from '$lib/utils/helper';
	import { Button, Divider, Typography } from 'imbento-box-ui';
	import { onMount } from 'svelte';

	type GAME_STATE = 'menu' | 'game' | 'success';

	let currState: GAME_STATE = $state('menu');

	let validationGraph: Graph<string[]> = $state(new Graph<string[]>());
	let guess: string = $state('hello');
	let answers: string[] = $state([]);
	let selectedIdx: number = $state(0);
	// let guessInputEl: HTMLInputElement | null = null;
	let tz: string;

	let downDisabled = $derived(selectedIdx === 0);
	let upDisabled = $derived(selectedIdx === answers.length - 1);

	let nextLength = $derived(selectedIdx + 5);
	let limit = $derived(`${guess.length}/${nextLength}`);

	let isValidLength = $derived(guess.length === nextLength);
	let isValidPath = $derived(validateGuess(guess, answers[selectedIdx] || '', validationGraph));
	let isValidWord = $derived(isValidLength && isValidPath);

	const handleSubmit = (e: SubmitEvent) => {
		e.preventDefault();

		if (!isValidWord) return;

		if (selectedIdx === answers.length - 1) {
			answers.push(guess);
			selectedIdx = answers.length - 1;
		} else {
			answers.splice(selectedIdx + 1);
			answers.push(guess);
			selectedIdx = answers.length - 1;
		}
		guess = '';
	};

	function handleDelete(idx: number) {
		answers.splice(idx);
		selectedIdx = answers.length - 1;
	}

	function handleDownClick() {
		if (selectedIdx > 0) selectedIdx--;
	}

	function handleUpClick() {
		if (selectedIdx < answers.length - 1) selectedIdx++;
	}

	function validateGuess(guess: string, prevAnswer: string, graph: Graph<string[]>): boolean {
		const guessSig = wordToSignature(guess);
		const prevSig = wordToSignature(prevAnswer);

		const guessData = graph.getVertexData(guessSig);
		const prevNeigbhors = graph.getNeighbors(prevSig);

		if (!prevNeigbhors.includes(guessSig)) return false;
		if (guessData !== undefined && !guessData.includes(guess)) return false;

		return true;
	}

	async function handleReset(): Promise<void> {
		answers = [];
		guess = '';
		const { word, graph } = await getDailyWordData();
		answers.push(word);
		validationGraph = graph;
		// guessInputEl.focus();
	}

	onMount(async () => {
		tz =
			Intl.DateTimeFormat().resolvedOptions().timeZone ??
			`UTC${Math.round(-new Date().getTimezoneOffset() / 60)}`;

		await saveTimezone(tz);

		await handleReset();
	});
</script>

{#if currState === 'menu'}
	<Button
		class="px-8 py-4 hover:bg-red hover:**:text-white"
		size="medium"
		onClick={() => (currState = 'game')}
		align="left"
	>
		<Typography>
			<span class="text-red">daily</span> play
		</Typography>
	</Button>
	<Divider axis="horizontal" />
	<Button class="group px-8 py-4 hover:bg-black" size="medium" onClick={handleReset} align="left">
		<Typography class="group-hover:text-white">how to play?</Typography>
	</Button>
	<Divider axis="horizontal" />
	<div class="flex flex-row justify-between px-8 py-4">
		<Typography class="flex-1" align="left">best score</Typography>
		<Typography class="flex-1 font-mono" align="right">10</Typography>
	</div>
	<Divider axis="horizontal" />
{:else if currState === 'game'}
	<GuessInput bind:guess {limit} {isValidWord} {handleSubmit} />
	<Divider axis="horizontal" />
	<WordList
		{guess}
		words={answers}
		onDownClick={handleDownClick}
		onUpClick={handleUpClick}
		{downDisabled}
		{upDisabled}
		{selectedIdx}
		onDelete={handleDelete}
	/>
{:else if currState === 'success'}
	<div>Success</div>
{/if}
