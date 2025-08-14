<script lang="ts">
	import ArcChart from '$lib/components/charts/arc-chart.svelte';
	import BarChart from '$lib/components/charts/bar-chart.svelte';
	import LineChart from '$lib/components/charts/line-chart.svelte';
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

	const multiSeriesData: Array<{ date: Date; apples: number; bananas: number; oranges: number }> = [
		{ date: new Date('2025-07-15T06:00:00.000Z'), apples: 57, bananas: 83, oranges: 34 },
		{ date: new Date('2025-07-16T06:00:00.000Z'), apples: 53, bananas: 24, oranges: 16 },
		{ date: new Date('2025-07-17T06:00:00.000Z'), apples: 43, bananas: 49, oranges: 100 },
		{ date: new Date('2025-07-18T06:00:00.000Z'), apples: 10, bananas: 77, oranges: 51 },
		{ date: new Date('2025-07-19T06:00:00.000Z'), apples: 12, bananas: 98, oranges: 19 },
		{ date: new Date('2025-07-20T06:00:00.000Z'), apples: 50, bananas: 88, oranges: 76 },
		{ date: new Date('2025-07-21T06:00:00.000Z'), apples: 16, bananas: 15, oranges: 40 },
		{ date: new Date('2025-07-22T06:00:00.000Z'), apples: 61, bananas: 64, oranges: 86 },
		{ date: new Date('2025-07-23T06:00:00.000Z'), apples: 67, bananas: 28, oranges: 84 },
		{ date: new Date('2025-07-24T06:00:00.000Z'), apples: 77, bananas: 43, oranges: 61 },
		{ date: new Date('2025-07-25T06:00:00.000Z'), apples: 65, bananas: 50, oranges: 25 },
		{ date: new Date('2025-07-26T06:00:00.000Z'), apples: 48, bananas: 13, oranges: 57 },
		{ date: new Date('2025-07-27T06:00:00.000Z'), apples: 75, bananas: 42, oranges: 58 },
		{ date: new Date('2025-07-28T06:00:00.000Z'), apples: 33, bananas: 25, oranges: 43 },
		{ date: new Date('2025-07-29T06:00:00.000Z'), apples: 50, bananas: 30, oranges: 49 },
		{ date: new Date('2025-07-30T06:00:00.000Z'), apples: 25, bananas: 76, oranges: 91 },
		{ date: new Date('2025-07-31T06:00:00.000Z'), apples: 84, bananas: 20, oranges: 37 },
		{ date: new Date('2025-08-01T06:00:00.000Z'), apples: 97, bananas: 62, oranges: 73 },
		{ date: new Date('2025-08-02T06:00:00.000Z'), apples: 64, bananas: 58, oranges: 84 },
		{ date: new Date('2025-08-03T06:00:00.000Z'), apples: 41, bananas: 85, oranges: 57 },
		{ date: new Date('2025-08-04T06:00:00.000Z'), apples: 26, bananas: 32, oranges: 13 },
		{ date: new Date('2025-08-05T06:00:00.000Z'), apples: 72, bananas: 43, oranges: 32 },
		{ date: new Date('2025-08-06T06:00:00.000Z'), apples: 15, bananas: 29, oranges: 38 },
		{ date: new Date('2025-08-07T06:00:00.000Z'), apples: 57, bananas: 23, oranges: 29 },
		{ date: new Date('2025-08-08T06:00:00.000Z'), apples: 57, bananas: 18, oranges: 54 },
		{ date: new Date('2025-08-09T06:00:00.000Z'), apples: 76, bananas: 49, oranges: 34 },
		{ date: new Date('2025-08-10T06:00:00.000Z'), apples: 84, bananas: 46, oranges: 54 },
		{ date: new Date('2025-08-11T06:00:00.000Z'), apples: 15, bananas: 59, oranges: 12 },
		{ date: new Date('2025-08-12T06:00:00.000Z'), apples: 33, bananas: 22, oranges: 74 },
		{ date: new Date('2025-08-13T06:00:00.000Z'), apples: 38, bananas: 84, oranges: 95 }
	];
</script>

<div class="flex flex-1 flex-col gap-8 p-8">
	<!-- Demo BarChart for Subpartidas using provided dataset -->
	<BarChart data={dateSeriesData} color="fill-blue-600" />

	<!-- Demo LineChart for Subpartidas using provided dataset -->
	<LineChart
		data={multiSeriesData}
		x="date"
		series={[
			{ key: 'apples', color: 'fill-blue-600' },
			{ key: 'bananas', color: 'fill-red-600' },
			{ key: 'oranges', color: 'fill-green-600' }
		]}
		onPointClick={(e, detail) => {
			console.log(e, detail);
			alert(JSON.stringify(detail));
		}}
	/>

	{#if !components?.length}
		<div class="flex h-[200px] items-center justify-center text-muted-foreground">
			No hay subpartidas para este proyecto
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


