<script lang="ts">
	import { fetchWordData } from '$lib';
	import AnswerList from '$lib/components/AnswerList.svelte';
	import { Graph } from '$lib/datatypes/Graph';
	import { wordToSignature } from '$lib/helper';
	import { onMount } from 'svelte';

	let validationGraph: Graph<string[]> = $state(new Graph<string[]>());
	let guess: string = $state('');
	let answers: string[] = $state([]);
	let guessInputEl: HTMLInputElement;

	async function handleWordSubmit(
		guess: string,
		prevAnswer: string,
		graph: Graph<string[]>
	): Promise<void> {
		const isValid = validateGuess(guess, prevAnswer, graph);

		if (isValid) answers.push(guess.toLowerCase());
	}

	function handleDeleteAnswer(answers: any[], idx: number): void {
		answers.splice(idx);
	}

	function validateGuess(guess: string, prevAnswer: string, graph: Graph<string[]>): boolean {
		const guessSig = wordToSignature(guess);
		const prevSig = wordToSignature(prevAnswer);

		const guessData = graph.getVertexData(guessSig);
		const prevNeigbhors = graph.getNeighbors(prevSig);

		if (!prevNeigbhors.includes(guessSig)) return false;
		if (guessData !== undefined && guessData.includes(guessSig)) return false;

		return true;
	}

	async function handleReset(): Promise<void> {
		answers = [];
		guess = '';
		const { word, graph } = await fetchWordData();
		answers.push(word);
		validationGraph = graph;
		guessInputEl.focus();
	}

	onMount(async () => {
		handleReset();
	});
</script>

<div class="mx-auto flex w-64 flex-col items-center justify-center gap-4 py-4 font-mono">
	<form
		class="flex w-full flex-col items-center justify-center gap-2"
		onsubmit={(e) => {
			e.preventDefault();
			handleWordSubmit(guess.toLowerCase(), answers[answers.length - 1] || '', validationGraph);
			guess = '';
			guessInputEl.focus();
		}}
		autocomplete="off"
	>
		<input
			name="starting-word"
			placeholder="Enter starting word"
			class="w-full placeholder:text-center"
			bind:value={guess}
			bind:this={guessInputEl}
		/>
	</form>
	<div class="flex flex-row items-center justify-center">
		{validateGuess(guess, answers[answers.length - 1] || '', validationGraph)
			? 'is valid'
			: 'is not valid'}
	</div>
	<button class="border px-2 py-0.5 hover:cursor-pointer" onclick={handleReset}> reset </button>
	<!-- UI: Guess len vs. Last answer len -->
	{#if answers.length}
		<div class="flex flex-row items-center justify-between gap-4">
			<div
				class={guess.length !== answers[answers.length - 1].length + 1
					? 'text-red-500'
					: 'text-blue-500'}
			>
				{guess.length} / {answers[answers.length - 1].length + 1}
			</div>
		</div>
	{/if}
	<AnswerList {answers} {guess} {handleDeleteAnswer} />
</div>
