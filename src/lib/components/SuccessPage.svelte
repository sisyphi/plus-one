<script lang="ts">
	import { leadingZero, type GameState } from '$lib/utils/helper';
	import type { PlayerData } from '$lib/utils/playerData';
	import { Button, Divider, Typography } from 'imbento-box-ui';
	import ScoreDistribution from './ScoreDistribution.svelte';

	interface SuccessPageProps {
		state: GameState;
		playerData: PlayerData;
		score: number;
	}

	let { state = $bindable(), playerData, score }: SuccessPageProps = $props();

	let { currStreak, bestStreak, lastScore } = $derived(playerData);

	function createShareText() {
		const today = new Date().toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});

		const colorBlocks = ['🟥', '🟧', '🟨', '🟩', '🟦', '🟪'];
		const blackBlocks = ['⬛️', '⬛️', '⬛️', '⬛️', '⬛️', '⬛️'];

		// TODO::if score > colorBlocks.length, show special message
		const blocks = [...colorBlocks.slice(0, score), ...blackBlocks.slice(score)].join('');

		return `Plus One - ${today}\n${blocks}\n`;
	}

	function handleShare() {
		const shareText = createShareText();
		navigator.clipboard.writeText(shareText);
	}
</script>

<div class="flex flex-row">
	<div class="flex flex-1 flex-col items-center justify-center">
		<Typography class="w-full bg-red py-2 leading-4" size="sm" color="white">
			current<br />score
		</Typography>
		<Divider axis="horizontal" />
		<Typography class="py-2 font-mono" size="xl">{leadingZero(score, 2)}</Typography>
	</div>
	<Divider axis="vertical" />
	<div class="flex flex-1 flex-col items-center justify-center">
		<Typography class="w-full bg-red py-2 leading-4" size="sm" color="white">
			highest<br />attempt
		</Typography>
		<Divider axis="horizontal" />
		<Typography class="py-2 font-mono" size="xl">
			{leadingZero(lastScore ?? 0, 2)}
		</Typography>
	</div>
	<Divider axis="vertical" />
	<div class="flex flex-1 flex-col items-center justify-center">
		<Typography class="w-full bg-red py-2 leading-4" size="sm" color="white">
			current<br />streak
		</Typography>
		<Divider axis="horizontal" />
		<Typography class="py-2 font-mono" size="xl">{leadingZero(currStreak, 2)}</Typography>
	</div>
	<Divider axis="vertical" />
	<div class="flex flex-1 flex-col items-center justify-center">
		<Typography class="w-full bg-red py-2 leading-4" size="sm" color="white">
			best<br />streak
		</Typography>
		<Divider axis="horizontal" />
		<Typography class="py-2 font-mono" size="xl">{leadingZero(bestStreak, 2)}</Typography>
	</div>
</div>
<Divider axis="horizontal" />
<div class="h-8 bg-red"></div>
<Divider axis="horizontal" />
<ScoreDistribution data={playerData.scoreDist} currScore={score} maxScore={6} />
<Button onClick={handleShare}>
	<Typography>share!</Typography>
</Button>
<Divider axis="horizontal" />
<Button onClick={() => (state = 'menu')}>
	<Typography>back to menu</Typography>
</Button>
<Divider axis="horizontal" />
