<script lang="ts">
	import AnswerList from '$lib/components/AnswerList.svelte';
	import { isOneLetterApart, isWordValid, loadFile, randElement, type WordData } from '$lib/helper';
	import { onMount } from 'svelte';

	let wordData: WordData = $state([]);
	let startingWords: string[] = [];
	let guess: string = $state('');
	let answers: string[] = $state([]);
	let guessInputEl: HTMLInputElement;

	function handleWordSubmit(answers: string[], word: string): void {
		if (answers.length > 0) {
			if (answers[answers.length - 1].length + 1 !== word.length) return;
			if (!isOneLetterApart(answers[answers.length - 1], word)) return;
		}

		if (!isWordValid(word, wordData)) return;

		answers.push(word.toLowerCase());
	}

	function handleDeleteAnswer(answers: any[], idx: number): void {
		answers.splice(idx);
	}

	onMount(async () => {
		wordData = await loadFile('plus_one', 'json');
		startingWords = await loadFile('1000_4_letter_words', 'txt');
		answers.push(randElement(startingWords));
		guessInputEl.focus();
	});
</script>

<div class="mx-auto flex w-64 flex-col items-center justify-center gap-4 py-4 font-mono">
	<form
		class="flex w-full flex-col items-center justify-center gap-2"
		onsubmit={(e) => {
			e.preventDefault();
			handleWordSubmit(answers, guess);
			guess = '';
			guessInputEl.focus();
		}}
		autocomplete="off"
	>
		<input
			name="starting-word"
			placeholder="Enter starting word"
			class="w-full caret-transparent placeholder:text-center"
			bind:value={guess}
			bind:this={guessInputEl}
		/>
		<div>{isWordValid(guess, wordData) ? 'is a valid word' : 'is not a valid word'}</div>
	</form>
	<button
		class="border px-2 py-0.5 hover:cursor-pointer"
		onclick={() => {
			answers = [];
			answers.push(randElement(startingWords));
			guess = '';
			guessInputEl.focus();
		}}
	>
		reset
	</button>
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
