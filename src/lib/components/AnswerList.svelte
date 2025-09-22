<script lang="ts">
	import HighlightText from '$lib/components/HighlightText.svelte';

	type AnswerListProps = {
		answers: string[];
		guess: string;
		handleDeleteAnswer: (answers: string[], idx: number) => void;
	};

	const { answers, guess, handleDeleteAnswer }: AnswerListProps = $props();
</script>

{#if answers.length}
	<div class="flex w-full flex-col items-center justify-between gap-2">
		{#each [...answers].reverse() as answer, idx}
			<div class="flex w-full flex-row items-center justify-between gap-4">
				{#if idx === 0}
					<HighlightText highlights={guess.split('')} text={answer} />
				{:else}
					<div>{answer}</div>
				{/if}
				<button
					class="border px-2 py-0.5 hover:cursor-pointer"
					onclick={() => handleDeleteAnswer(answers, answers.length - 1 - idx)}
				>
					del
				</button>
			</div>
		{/each}
	</div>
{/if}
