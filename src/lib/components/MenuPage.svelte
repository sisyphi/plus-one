<script lang="ts">
	import type { GameState } from '$lib/utils/helper';
	import { Calendar1Icon } from '@lucide/svelte';
	import { Button, Typography, Divider, cn } from 'imbento-box-ui';

	interface MenuPageProps {
		appState: GameState;
		loading: boolean;
	}

	let { appState = $bindable(), loading }: MenuPageProps = $props();
</script>

<Button
	class={cn(
		'flex flex-row gap-2 px-8 py-4 hover:bg-red hover:**:text-white',
		loading && '**:text-black'
	)}
	size="medium"
	onClick={() => (appState = 'game')}
	align="left"
	disabled={loading}
>
	<Calendar1Icon strokeWidth={2.5} />
	<Typography>
		<span class="text-red">daily</span> play
	</Typography>
</Button>
<Divider axis="horizontal" />
<!-- <Button
	class="px-8 py-4 hover:bg-black hover:**:text-white"
	size="medium"
	onClick={() => (appState = 'guide')}
	align="left"
>
	<Typography>how to play?</Typography>
</Button>
<Divider axis="horizontal" /> -->
<!-- <div class="flex flex-row justify-between px-8 py-4">
	<Typography class="flex-1" align="left">best word</Typography>
	<Typography class="flex-1 font-mono" align="right">{bestWord}</Typography>
</div>
<Divider axis="horizontal" /> -->
