<script lang="ts">
	import { PencilIcon, PenIcon, Trash2Icon, XIcon } from '@lucide/svelte';
	import { cn, Typography, Divider, Button } from 'imbento-box-ui';

	interface WordListItemProps {
		text: string;
		idx: number;
		highlight?: boolean;
		onDelete: () => void;
		removeDelete?: boolean;
	}

	let { text, idx, highlight, onDelete, removeDelete = false }: WordListItemProps = $props();
</script>

<!-- TODO::auto text color adjust to bg color -->
<div class={cn('flex h-10 flex-row')}>
	<div class={cn('flex h-full flex-row items-center justify-between gap-4')}>
		<div class={cn('flex h-full flex-row', highlight && 'bg-red')}>
			{#if !removeDelete}
				<Typography
					class={cn('flex size-10 flex-row items-center justify-center')}
					color={highlight ? 'white' : 'black'}
				>
					{#if highlight}
						<PencilIcon strokeWidth={2.5} class={cn('w-full')} />
					{:else}
						{idx - 1}
					{/if}
				</Typography>
			{:else}
				<Typography class={cn('flex size-10 flex-row items-center justify-center')}>D</Typography>
			{/if}
			<Divider axis="vertical" class="h-full" />
		</div>
	</div>
	<div
		class={cn(
			'flex h-full flex-1 flex-row items-center justify-start gap-2 px-4',
			highlight && 'bg-red'
		)}
	>
		<Typography class={cn('font-mono', highlight && 'text-white')}>
			{text}
		</Typography>
	</div>
	<div class={cn('flex h-full flex-row items-center justify-between gap-4')}>
		<div class={cn('flex h-full flex-row')}>
			<Divider axis="vertical" class="h-full" />
			{#if !removeDelete}
				<Button
					onClick={onDelete}
					padding="icon"
					class={cn('size-10 not-disabled:hover:bg-red not-disabled:hover:text-white')}
				>
					<Trash2Icon size={24} strokeWidth={2.5} />
				</Button>
			{:else}
				<div class={cn('size-10')}></div>
			{/if}
		</div>
	</div>
</div>
