<script lang="ts">
	import type { GameState } from '$lib/utils/helper';
	import type { PlayerData } from '$lib/utils/playerData';
	import { Button, Typography } from 'imbento-box-ui';

	interface SuccessPageProps {
		state: GameState;
		playerData: PlayerData;
		score: number;
	}

	let { state = $bindable(), playerData, score }: SuccessPageProps = $props();

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

<Typography>Best Streak: {playerData.bestStreak}</Typography>
<Typography>Current Streak: {playerData.currStreak}</Typography>
<Typography>Score: {score}</Typography>
<Typography>Highest Score Today: {playerData.lastScore}</Typography>
<!-- <ScoreDistribution data={playerData.scoreDist} maxScore={6}/> -->
<Button onClick={handleShare}><Typography>share!</Typography></Button>
<Button onClick={() => (state = 'menu')}>
	<Typography>back to menu</Typography>
</Button>
