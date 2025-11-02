<script lang="ts">
	import type { GameState } from '$lib/utils/helper';
	import { Button, Typography, Divider } from 'imbento-box-ui';

	interface MenuPageProps {
		state: GameState;
	}

	let { state = $bindable() }: MenuPageProps = $props();

	const bestWord = 'N/A';
</script>

<Button
	class="px-8 py-4 hover:bg-red hover:**:text-white"
	size="medium"
	onClick={() => (state = 'game')}
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
	onClick={() => (state = 'guide')}
	align="left"
>
	<Typography>how to play?</Typography>
</Button>
<Divider axis="horizontal" />
<div class="flex flex-row justify-between px-8 py-4">
	<Typography class="flex-1" align="left">best word</Typography>
	<Typography class="flex-1 font-mono" align="right">{bestWord}</Typography>
</div>
<Divider axis="horizontal" />
