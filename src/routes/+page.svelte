<script lang="ts">
	import AnswerList from '$lib/components/AnswerList.svelte';
	import { type WordData } from '$lib/helper';
	import { onMount } from 'svelte';

	let wordData: WordData = $state([]);
	let startingWord: string = $state('');
	let guess: string = $state('');
	let answers: string[] = $state([]);
	let guessInputEl: HTMLInputElement;

	async function handleWordSubmit(guess: string, prevAnswer: string): Promise<void> {
		const { valid, reason } = await validateGuess(guess, prevAnswer);

		if (valid) answers.push(guess.toLowerCase());
	}

	function handleDeleteAnswer(answers: any[], idx: number): void {
		answers.splice(idx);
	}

	async function fetchStartingWord(): Promise<string> {
		const res = await fetch('/api/starting-word');
		const { data } = await res.json();
		return data;
	}

	async function validateGuess(
		guess: string,
		prevAnswer: string
	): Promise<{ valid: boolean; reason: string }> {
		const res = await fetch('/api/validate-guess', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ guess, prevAnswer })
		});
		const data = await res.json();
		return data;
	}

	async function handleReset(): Promise<void> {
		answers = [];
		const startingWord = await fetchStartingWord();
		answers.push(startingWord);
		guess = '';
		guessInputEl.focus();
	}

	onMount(async () => {
		startingWord = await fetchStartingWord();
		answers.push(startingWord);
		guessInputEl.focus();
	});
</script>

<div class="mx-auto flex w-64 flex-col items-center justify-center gap-4 py-4 font-mono">
	<form
		class="flex w-full flex-col items-center justify-center gap-2"
		onsubmit={(e) => {
			if (answers.length) {
				e.preventDefault();
				handleWordSubmit(guess.toLowerCase(), answers[answers.length - 1]);
				guess = '';
				guessInputEl.focus();
			}
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
