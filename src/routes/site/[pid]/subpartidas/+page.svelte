<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import RadialChart from '$lib/components/radial-chart.svelte';
	import BarChart from '$lib/components/bar-chart.svelte';
	import LineChartMultiple from '$lib/components/line-chart-multiple.svelte';
	
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

	// Sample data for demonstration
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


	// Helper function to format percentage
	const formatPercent = (value: number) => `${value}%`;
</script>

<div class="flex flex-1 flex-col gap-8 p-8">
	<!-- Summary Metrics for Subpartidas -->
	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
		<Card.Root class="p-4">
			<Card.Title class="text-sm font-medium text-muted-foreground">Total Subpartidas</Card.Title>
			<Card.Content class="p-0">
				<div class="text-2xl font-bold">{components?.length || 0}</div>
			</Card.Content>
		</Card.Root>
		
		<Card.Root class="p-4">
			<Card.Title class="text-sm font-medium text-muted-foreground">Promedio Avance</Card.Title>
			<Card.Content class="p-0">
				<div class="text-2xl font-bold">
					{formatPercent(components?.length ? Math.round(components.reduce((sum, c) => sum + c.percent, 0) / components.length) : 0)}
				</div>
			</Card.Content>
		</Card.Root>
		
		<Card.Root class="p-4">
			<Card.Title class="text-sm font-medium text-muted-foreground">Máximo Avance</Card.Title>
			<Card.Content class="p-0">
				<div class="text-2xl font-bold">
					{formatPercent(components?.length ? Math.max(...components.map(c => c.percent)) : 0)}
				</div>
			</Card.Content>
		</Card.Root>
		
		<Card.Root class="p-4">
			<Card.Title class="text-sm font-medium text-muted-foreground">Mínimo Avance</Card.Title>
			<Card.Content class="p-0">
				<div class="text-2xl font-bold">
					{formatPercent(components?.length ? Math.min(...components.map(c => c.percent)) : 0)}
				</div>
			</Card.Content>
		</Card.Root>
	</div>

	<!-- Chart Widgets Grid -->
	<div class="grid auto-rows-min gap-4 md:grid-cols-2">
		<!-- Enhanced BarChart using ChartContainer and ChartTooltip -->
		<div class="p-4">
			<h3 class="text-lg font-semibold mb-2">Progreso vs Línea Base</h3>
			<p class="text-sm text-muted-foreground mb-4">Comparación del avance real contra la planificación inicial</p>
			<BarChart
				data={dateSeriesData.map(item => ({
					month: item.date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }),
					planeada: item.baseline,
					real: item.value
				}))}
			/>
		</div>

		<!-- Enhanced LineChart using ChartContainer and ChartTooltip -->
		<div class="p-4">
			<h3 class="text-lg font-semibold mb-2">Evolución Temporal por Categoría</h3>
			<p class="text-sm text-muted-foreground mb-4">Seguimiento del progreso de diferentes tipos de subpartidas</p>
			<LineChartMultiple />
		</div>
	</div>

	{#if !components?.length}
		<div class="flex h-[200px] items-center justify-center text-muted-foreground">
			No hay subpartidas para este proyecto
		</div>
	{:else}
		<div class="space-y-4">
			<h3 class="text-lg font-semibold">Resumen por Subpartida</h3>
			<div class="grid auto-rows-min gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{#each components as component (component.id)}
					<div class="aspect-square rounded-xl">
						<RadialChart title={component.name} value={component.percent} description="" />
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>


