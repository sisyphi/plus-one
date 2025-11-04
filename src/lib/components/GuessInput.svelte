<script lang="ts">
	import { cn, TextField } from 'imbento-box-ui';

	interface GuessInputProps {
		guess: string;
		handleSubmit: (e: SubmitEvent) => void;
	}

	let { guess = $bindable(), handleSubmit }: GuessInputProps = $props();
</script>

<form class={cn('flex flex-1 flex-row items-center')} onsubmit={handleSubmit} autocomplete="off">
	<TextField bind:value={guess} placeholder="type here" class={cn('flex-1')} />
</form>
