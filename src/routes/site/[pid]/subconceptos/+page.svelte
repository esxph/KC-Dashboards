<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import ArcChart from '$lib/components/charts/arc-chart.svelte';
	import BarChartComponent from '$lib/components/charts/bar-chart.svelte';
	let { data } = $props();
	let { components } = $derived(data);

	// Chart configuration for consistent styling and behavior
	const chartConfig = {
		value: { label: 'Avance Real', color: '#2563eb' },
		baseline: { label: 'Línea Base', color: '#6b7280' },
		apples: { label: 'Subpartida A', color: '#2563eb' },
		bananas: { label: 'Subpartida B', color: '#dc2626' },
		oranges: { label: 'Subpartida C', color: '#16a34a' }
	};

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
	<!-- Chart Widgets Grid -->
	<div class="grid auto-rows-min gap-4 md:grid-cols-2">
		<!-- Enhanced BarChart using ChartContainer and ChartTooltip -->
		<BarChartComponent
			title="Progreso vs Línea Base"
			description="Comparación del avance real contra la planificación inicial"
			data={dateSeriesData}
			x="date"
			y="value"
			series={[
				{ key: 'baseline', color: 'var(--color-surface-content)', props: { fillOpacity: 0.2 } },
				{ key: 'value', color: '#2563eb', props: { insets: { x: 8 } } }
			]}
			chartConfig={chartConfig}
		/>
	</div>

	{#if !components?.length}
		<div class="flex h-[200px] items-center justify-center text-muted-foreground">
			No hay subpartidas para este proyecto
		</div>
	{:else}
		<div class="space-y-4">
			<h3 class="text-lg font-semibold">Resumen por Subconcepto</h3>
			<div class="grid auto-rows-min gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{#each components as component (component.id)}
					<div class="aspect-square rounded-xl">
						<ArcChart title={component.name} value={component.percent} description="" />
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>


