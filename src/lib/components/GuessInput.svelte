<script lang="ts">
	import { cn, TextField } from 'imbento-box-ui';

	interface GuessInputProps {
		guess: string;
		handleSubmit: (e: SubmitEvent) => void;
		placeholder?: string;
	}

	let { guess = $bindable(), placeholder = 'type here', handleSubmit }: GuessInputProps = $props();
</script>

<form class={cn('flex flex-row items-center')} onsubmit={handleSubmit} autocomplete="off">
	<TextField bind:value={guess} {placeholder} class={cn('flex-1')} />
</form>
