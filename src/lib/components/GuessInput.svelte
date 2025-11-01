<script lang="ts">
	import { CheckIcon, XIcon } from '@lucide/svelte';
	import { cn, Divider, TextField, Typography } from 'imbento-box-ui';

	interface GuessInputProps {
		guess: string;
		limit: string;
		isValidWord: boolean;
		handleSubmit: (e: SubmitEvent) => void;
	}

	let { guess = $bindable(), limit, isValidWord, handleSubmit }: GuessInputProps = $props();
</script>

<form class={cn('flex flex-row items-center')} onsubmit={handleSubmit} autocomplete="off">
	<TextField bind:value={guess} placeholder="type here" class={cn('flex-1')}>
		{#snippet suffix()}
			<Typography size="md" weight="semibold" class={cn('min-w-20 px-2 text-right')}>
				{limit}
			</Typography>
		{/snippet}
	</TextField>
	<Divider axis="vertical" />
	<div
		class={cn(
			'flex h-full w-10 flex-row items-center justify-center text-white',
			isValidWord && 'bg-green',
			!isValidWord && 'bg-red'
		)}
	>
		{#if isValidWord}
			<CheckIcon strokeWidth={4} class={cn('w-full')} />
		{:else}
			<XIcon strokeWidth={4} class={cn('w-full')} />
		{/if}
	</div>
</form>
