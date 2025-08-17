<script lang="ts">
	import MapViewer from '$lib/components/map-viewer.svelte';
	import ArcChart from '$lib/components/charts/arc-chart.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import LineChartComponent from '$lib/components/charts/line-chart.svelte';

	const { data } = $props();
	const { partidas, overallProgress, kmzExists, kmzUrl, project,locations } = $derived(data);

	// Chart configuration for consistent styling and behavior
	const chartConfig = {
		value: { label: 'Avance Real', color: '#2563eb' },
		baseline: { label: 'Línea Base', color: '#6b7280' },
	};

	const multiSeriesData: Array<{ date: Date; Real: number; Projectado: number }> = [
	{ date: new Date('2025-07-15T06:00:00.000Z'), Real: 0, Projectado: 0 },
	{ date: new Date('2025-07-16T06:00:00.000Z'), Real: 5, Projectado: 2 },
	{ date: new Date('2025-07-17T06:00:00.000Z'), Real: 10, Projectado: 6 },
	{ date: new Date('2025-07-18T06:00:00.000Z'), Real: 15, Projectado: 10 },
	{ date: new Date('2025-07-19T06:00:00.000Z'), Real: 20, Projectado: 12 },
	{ date: new Date('2025-07-20T06:00:00.000Z'), Real: 25, Projectado: 14 },
	{ date: new Date('2025-07-21T06:00:00.000Z'), Real: 30, Projectado: 16 },
	{ date: new Date('2025-07-22T06:00:00.000Z'), Real: 35, Projectado: 18 },
	{ date: new Date('2025-07-23T06:00:00.000Z'), Real: 40, Projectado: 20 },
	{ date: new Date('2025-07-24T06:00:00.000Z'), Real: 45, Projectado: 22 },
	{ date: new Date('2025-07-25T06:00:00.000Z'), Real: 50, Projectado: 24 },
	{ date: new Date('2025-07-26T06:00:00.000Z'), Real: 55, Projectado: 26 },
	{ date: new Date('2025-07-27T06:00:00.000Z'), Real: 60, Projectado: 35 },
	{ date: new Date('2025-07-28T06:00:00.000Z'), Real: 65, Projectado: 50 },
	{ date: new Date('2025-07-29T06:00:00.000Z'), Real: 70, Projectado: 65 },
	{ date: new Date('2025-07-30T06:00:00.000Z'), Real: 75, Projectado: 78 },
	{ date: new Date('2025-07-31T06:00:00.000Z'), Real: 80, Projectado: 80 },
	{ date: new Date('2025-08-02T06:00:00.000Z'), Real: 85, Projectado: 82 },
	{ date: new Date('2025-08-04T06:00:00.000Z'), Real: 95, Projectado: 95 },
	{ date: new Date('2025-08-05T06:00:00.000Z'), Real: 100, Projectado: 100 },
	];
</script>

<div class="h-full flex-1 flex-col gap-2 p-4 md:gap-8 md:p-8 md:flex">
	<!-- Header -->
	<div class="flex items-center justify-between gap-1">
		<div class="flex flex-col gap-1">
			<h2 class="text-xl font-semibold tracking-tight md:text-2xl">
				¡Bienvenido a {project.name}!
			</h2>
			<p class="text-muted-foreground">Resumen general del progreso.</p>
		</div>
	</div>

	<!-- Main Content -->
	<div class="flex h-full flex-col gap-4 md:gap-6 mt-2">
        <!-- Top Section: Map and Overall Progress Widget -->
        <div class="hidden md:flex flex min-h-0 flex-[2] flex-col gap-4 lg:flex-row lg:gap-6">
			<!-- Map Section -->
			<div class="min-h-0 flex-[4] min-h-[500px] lg:min-h-0">
				{#if kmzExists && kmzUrl}
					<MapViewer {kmzUrl} {locations} autoLoad={true} class="h-full" />
				{:else}
					<div
						class="flex h-full items-center justify-center rounded-lg border-2 border-dashed border-gray-300"
					>
						<div class="text-center text-muted-foreground">
							<p class="text-lg font-medium">Mapa no disponible</p>
							<p class="text-sm">No se encontró el archivo KMZ/KMZ.kmz para este proyecto</p>
						</div>
					</div>
				{/if}
			</div>
          <!-- Overall Progress Widget -->
          <div class="min-h-0 flex-1 min-w-[180px] lg:min-w-0">
				<ArcChart
					title="Progreso General"
					value={overallProgress}
					description={partidas.length == 0
						? 'Sin partidas'
						: partidas.length == 1
							? '1 partida'
							: partidas.length + ' partidas'}
					color="fill-green-600"
				/>
			</div>
		</div>

		<!-- Enhanced LineChart using ChartContainer and ChartTooltip -->
		<LineChartComponent
			title="Evolución Temporal del Proyecto"
			description="Seguimiento del progreso real vs proyectado"
			data={multiSeriesData}
			x="date"
			series={[
				{ key: 'Real', color: '#2563eb' },
				{ key: 'Projectado', color: '#16a34a' },
			]}
			onPointClick={(e: any, detail: any) => {
				console.log(e, detail);
				alert(JSON.stringify(detail));
			}}
			chartConfig={chartConfig}
		/>

		
		
		<!-- Bottom Section: Individual Partidas Widgets -->
		<div class="min-h-0 flex-1">
			{#if !partidas.length}
				<div
					class="flex h-full items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-muted-foreground"
				>
					<div class="text-center">
						<p class="text-lg font-medium">Sin partidas</p>
						<p class="text-sm">No hay partidas definidas para este proyecto</p>
					</div>
				</div>
			{:else}
				<div class="h-full">
					<h3 class="mb-3 text-lg font-semibold md:mb-4">Progreso por Partidas</h3>
					<div class="grid gap-3 md:gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
						<div class="md:hidden aspect-square min-h-0 overflow-hidden">
							<ArcChart
								title="Progreso General"
								value={overallProgress|| 0}
								color="fill-green-600"
							/>
						</div>
						{#each partidas as partida (partida.id)}
							<div class="aspect-square min-h-0 overflow-hidden">
								<ArcChart
									title={partida.name}
									value={partida.percent || 0}
								/>
							</div>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>
