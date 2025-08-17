<script lang="ts">
	import { LineChart } from 'layerchart';
	import { ChartContainer, ChartTooltip } from '$lib/components/ui/chart/index.js';
	import * as Card from '$lib/components/ui/card/index.js';

	let { 
		title, 
		description, 
		data, 
		x = 'date',
		series = [],
		onPointClick = undefined,
		chartConfig = {}
	} = $props();
</script>

<Card.Root class="flex flex-col overflow-hidden">
	<Card.Header class="items-center pb-0 flex-shrink-0">
		<Card.Title class="text-sm font-medium leading-tight">{title}</Card.Title>
		<Card.Description class="text-xs leading-tight">{description}</Card.Description>
	</Card.Header>
	<Card.Content class="flex-1 p-1 overflow-hidden">
		<div class="w-full h-[300px] flex items-center justify-center">
			<div class="w-full h-full w-[550px] h-[300px]">
				<ChartContainer config={chartConfig} class="h-full w-full p-4 border rounded-sm">
					<LineChart
						{data}
						{x}
						{series}
						{onPointClick}
					>
						{#snippet tooltip()}
							<ChartTooltip />
						{/snippet}
					</LineChart>
				</ChartContainer>
			</div>
		</div>
	</Card.Content>
</Card.Root>
