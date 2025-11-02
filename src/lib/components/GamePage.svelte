<script lang="ts">
	import { Divider, WordList, Button, Typography } from 'imbento-box-ui';
	import GuessInput from './GuessInput.svelte';
	import { wordToSignature, type GameState } from '$lib/utils/helper';
	import type { Graph } from '$lib/types/Graph';

	interface GamePageProps {
		state: GameState;
		guess: string;
		answers: string[];
		validationGraph: Graph<string[]>;
		selectedIdx: number;
		handleGameSubmit: () => void;
	}

	let {
		state = $bindable(),
		guess = $bindable(),
		answers = $bindable(),
		selectedIdx = $bindable(),
		validationGraph,
		handleGameSubmit
	}: GamePageProps = $props();

	let downDisabled = $derived(selectedIdx === 0);
	let upDisabled = $derived(selectedIdx === answers.length - 1);

	let nextLength = $derived(selectedIdx + 5);
	let limit = $derived(`${guess.length}/${nextLength}`);

	let isValidLength = $derived(guess.length === nextLength);
	let isValidPath = $derived(validateGuess(guess, answers[selectedIdx] || '', validationGraph));
	let isValidWord = $derived(isValidLength && isValidPath);

	function validateGuess(guess: string, prevAnswer: string, graph: Graph<string[]>): boolean {
		const guessSig = wordToSignature(guess);
		const prevSig = wordToSignature(prevAnswer);

		const guessData = graph.getVertexData(guessSig);
		const prevNeigbhors = graph.getNeighbors(prevSig);

		if (!prevNeigbhors.includes(guessSig)) return false;
		if (guessData !== undefined && !guessData.includes(guess)) return false;

		return true;
	}

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

	function handleGuessSubmit(e: SubmitEvent) {
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
	}
</script>

<GuessInput bind:guess {limit} {isValidWord} handleSubmit={handleGuessSubmit} />
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
<Button class="px-8 py-4 hover:bg-blue hover:**:text-white" onClick={handleGameSubmit}>
	<Typography>submit</Typography>
</Button>
<Divider axis="horizontal" />
