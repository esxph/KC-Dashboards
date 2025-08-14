<script lang="ts">
	import ArcChart from '$lib/components/charts/arc-chart.svelte';
	import BarChart from '$lib/components/charts/bar-chart.svelte';
	let { data } = $props();
	let { components } = $derived(data);

	const dateSeriesData: Array<{ date: Date; value: number; baseline: number }> = [
		{ date: new Date('2025-08-04T06:00:00.000Z'), value: 93, baseline: 49 },
		{ date: new Date('2025-08-05T06:00:00.000Z'), value: 25, baseline: 83 },
		{ date: new Date('2025-08-06T06:00:00.000Z'), value: 29, baseline: 46 },
		{ date: new Date('2025-08-07T06:00:00.000Z'), value: 55, baseline: 36 },
		{ date: new Date('2025-08-08T06:00:00.000Z'), value: 38, baseline: 45 },
		{ date: new Date('2025-08-09T06:00:00.000Z'), value: 58, baseline: 99 },
		{ date: new Date('2025-08-10T06:00:00.000Z'), value: 87, baseline: 82 },
		{ date: new Date('2025-08-11T06:00:00.000Z'), value: 51, baseline: 76 },
		{ date: new Date('2025-08-12T06:00:00.000Z'), value: 70, baseline: 43 },
		{ date: new Date('2025-08-13T06:00:00.000Z'), value: 51, baseline: 40 }
	];
</script>

<div class="flex flex-1 flex-col gap-8 p-8">
	<!-- Imported bar chart component (kept separate from the page) -->
	<BarChart data={dateSeriesData} color="fill-blue-600" />
	{#if !components?.length}
		<div class="flex h-[200px] items-center justify-center text-muted-foreground">
			No hay subconceptos para este proyecto
		</div>
	{:else}
		<div class="grid auto-rows-min gap-4 md:grid-cols-3 lg:grid-cols-4">
			{#each components as component (component.id)}
				<div class="aspect-square rounded-xl">
					<ArcChart title={component.name} value={component.percent} description="" />
				</div>
			{/each}
		</div>
	{/if}
</div>


