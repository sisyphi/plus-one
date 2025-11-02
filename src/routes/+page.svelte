<script lang="ts">
	import { getDailyWordData, saveTimezone } from './api';
	import { Graph } from '$lib/types/Graph';
	import { onMount } from 'svelte';
	import { getUserTimezone } from '$lib/utils/datetime';
	import {
		EMPTY_PLAYER_DATA,
		getPlayerData,
		updatePlayerData,
		type PlayerData
	} from '$lib/utils/playerData';
	import MenuPage from '$lib/components/MenuPage.svelte';
	import GamePage from '$lib/components/GamePage.svelte';
	import SuccessPage from '$lib/components/SuccessPage.svelte';
	import GuidePage from '$lib/components/GuidePage.svelte';
	import type { GameState } from '$lib/utils/helper';

	let currState: GameState = $state('menu');

	let dailyWord: string = '';
	let dailyGraph: Graph<string[]> = $state(new Graph<string[]>());
	let guess: string = $state('');
	let answers: string[] = $state([]);
	let selectedIdx: number = $state(0);
	let playerData: PlayerData = $state(EMPTY_PLAYER_DATA);
	let timeZone: string;
	let currScore: number = $state(0);

	function handleReset() {
		answers = [];
		guess = '';
		answers.push(dailyWord);
		selectedIdx = 0;
	}

	function handleGameSubmit() {
		updatePlayerData(answers.length - 1);

		currScore = answers.length - 1;

		handleReset();

		playerData = getPlayerData();
		currState = 'success';
	}

	onMount(async () => {
		timeZone = getUserTimezone();
		await saveTimezone(timeZone);

		const { word, graph } = await getDailyWordData();
		dailyWord = word;
		dailyGraph = graph;

		handleReset();
	});
</script>

{#if currState === 'menu'}
	<MenuPage bind:state={currState} />
{:else if currState === 'game'}
	<GamePage
		bind:state={currState}
		bind:guess
		bind:answers
		bind:selectedIdx
		validationGraph={dailyGraph}
		{handleGameSubmit}
	/>
{:else if currState === 'success'}
	<SuccessPage bind:state={currState} {playerData} score={currScore} />
{:else if currState === 'guide'}
	<GuidePage bind:state={currState} />
{/if}
