<script lang="ts">
	import type { GameState } from '$lib/utils/helper';
	import { XIcon } from '@lucide/svelte';
	import { Button, Typography } from 'imbento-box-ui';

	interface GuidePageProps {
		state: GameState;
	}

	let { state = $bindable() }: GuidePageProps = $props();
</script>

<Typography>guide page</Typography>
<Button onClick={() => (state = 'menu')} padding="icon"><XIcon strokeWidth={4} /></Button>
