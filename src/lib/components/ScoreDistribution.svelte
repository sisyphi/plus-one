<script lang="ts">
	import { leadingZero } from '$lib/utils/helper';
	import { cn, Divider, Typography } from 'imbento-box-ui';

	interface ScoreDistributionProps {
		data: Record<string, number>;
		currScore: number;
		maxScore: number;
	}

	let { data, currScore, maxScore }: ScoreDistributionProps = $props();

	let formattedData = $derived.by(() => {
		const base = Array.from({ length: maxScore }).map((_, idx) => {
			const score = idx + 1;
			return {
				label: String(score + 4),
				count: data[String(score)] ?? 0
			};
		});

		const overflowKeys = Object.keys(data)
			.map(Number)
			.filter((key) => key > maxScore);

		if (overflowKeys.length > 0) {
			const overflowSum = overflowKeys.reduce((sum, key) => sum + (data[String(key)] ?? 0), 0);
			base.push({
				label: '10+',
				count: overflowSum
			});
		}

		return base;
	});

	let activeScore = $derived(currScore <= maxScore ? `${currScore}` : `${maxScore + 1}+`);
	let maxCount = $derived(Math.max(...formattedData.map((d) => d.count), 1));
</script>

<Typography class="py-2" size="lg">guess distribution</Typography>
<Divider axis="horizontal" />
<div class="flex w-full flex-col">
	{#each formattedData.reverse() as { label, count }}
		<div class="flex flex-row items-center">
			<Typography class="w-10 font-mono" size="sm">
				{#if label.endsWith('+')}
					{label}
				{:else}
					{leadingZero(+label, 2)}
				{/if}
			</Typography>
			<Divider axis="vertical" />
			<div class="h-full flex-1 overflow-hidden">
				<div
					class={cn(
						'flex h-full justify-end bg-red transition-all duration-300',
						count !== 0 && count !== maxCount && 'border-r-4 border-black'
					)}
					style={`width: ${(count / maxCount) * 100}%;background-size: 25px 25px;`}
				>
					<Typography class="pr-2 font-mono" size="sm" color="white">
						{count}
					</Typography>
				</div>
			</div>
		</div>
		<Divider axis="horizontal" />
	{/each}
</div>
