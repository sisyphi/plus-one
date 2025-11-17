<script lang="ts">
	import { Graph } from '$lib/types/Graph';
	import { onMount } from 'svelte';
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
	import { gameState } from '$lib/stores/GameState.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let dailyWord = data.dailyWord;
	let dailyGraph: Graph<string[]> = $state(Graph.fromJSON(data.dailyGraph));

	let guess: string = $state('');
	let answers: string[] = $state([]);
	let selectedIdx: number = $state(0);
	let playerData: PlayerData = $state(EMPTY_PLAYER_DATA);
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
		gameState.value = 'success';
	}

	onMount(async () => {
		playerData = getPlayerData();

		handleReset();
	});
</script>

{#if gameState.value === 'menu'}
	<MenuPage />
{:else if gameState.value === 'game'}
	<GamePage
		bind:guess
		bind:answers
		bind:selectedIdx
		validationGraph={dailyGraph}
		{handleGameSubmit}
	/>
{:else if gameState.value === 'success'}
	<SuccessPage {playerData} score={currScore} />
{:else if gameState.value === 'guide'}
	<GuidePage />
{/if}
