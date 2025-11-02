<script lang="ts">
	import { getDailyWordData, saveTimezone } from './api';
	import GuessInput from '$lib/components/GuessInput.svelte';
	import WordList from '$lib/components/WordList.svelte';
	import { Graph } from '$lib/types/Graph';
	import { wordToSignature } from '$lib/utils/helper';
	import { Button, Divider, Typography } from 'imbento-box-ui';
	import { onMount } from 'svelte';
	import { getUserTimezone } from '$lib/utils/datetime';
	import { EMPTY_PLAYER_DATA, updatePlayerData, type PlayerData } from '$lib/utils/playerData';

	type GAME_STATE = 'menu' | 'game' | 'success' | 'guide';

	let currState: GAME_STATE = $state('menu');

	let validationGraph: Graph<string[]> = $state(new Graph<string[]>());
	let guess: string = $state('hello');
	let answers: string[] = $state([]);
	let selectedIdx: number = $state(0);
	let playerData: PlayerData = $state(EMPTY_PLAYER_DATA);
	// let guessInputEl: HTMLInputElement | null = null;
	let timeZone: string;

	let downDisabled = $derived(selectedIdx === 0);
	let upDisabled = $derived(selectedIdx === answers.length - 1);

	let nextLength = $derived(selectedIdx + 5);
	let limit = $derived(`${guess.length}/${nextLength}`);

	let isValidLength = $derived(guess.length === nextLength);
	let isValidPath = $derived(validateGuess(guess, answers[selectedIdx] || '', validationGraph));
	let isValidWord = $derived(isValidLength && isValidPath);

	const handleGuessSubmit = (e: SubmitEvent) => {
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
		timeZone = getUserTimezone();

		await saveTimezone(timeZone);

		await handleReset();
	});

	function createShareText() {
		const today = new Date().toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});

		const colorBlocks = ['🟥', '🟧', '🟨', '🟩', '🟦', '🟪'];
		const blackBlocks = ['⬛️', '⬛️', '⬛️', '⬛️', '⬛️', '⬛️'];

		const score = answers.length - 1;

		// TODO::if score > colorBlocks.length, show special message
		const blocks = [...colorBlocks.slice(0, score), ...blackBlocks.slice(score)].join('');

		return `Plus One - ${today}\n${blocks}\n`;
	}

	function handleGameSubmit() {
		playerData = updatePlayerData(answers.length - 1);

		currState = 'success';
	}

	function handleShare() {
		const shareText = createShareText();
		navigator.clipboard.writeText(shareText);
	}
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
	<Button
		class="px-8 py-4 hover:bg-black hover:**:text-white"
		size="medium"
		onClick={() => (currState = 'guide')}
		align="left"
	>
		<Typography>how to play?</Typography>
	</Button>
	<Divider axis="horizontal" />
	<div class="flex flex-row justify-between px-8 py-4">
		<Typography class="flex-1" align="left">best score</Typography>
		<Typography class="flex-1 font-mono" align="right">10</Typography>
	</div>
	<Divider axis="horizontal" />
{:else if currState === 'game'}
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
{:else if currState === 'success'}
	<Typography>Best Streak: {playerData.bestStreak}</Typography>
	<Typography>Current Streak: {playerData.currStreak}</Typography>
	<Typography>Score: {answers.length - 1}</Typography>
	<Typography>Highest Score Today: {playerData.lastScore}</Typography>
	<!-- <ScoreDistribution data={playerData.scoreDist} maxScore={6}/> -->
	<Button onClick={handleShare}><Typography>share!</Typography></Button>
{:else if currState === 'guide'}
	<Typography>Guide</Typography>
{/if}
