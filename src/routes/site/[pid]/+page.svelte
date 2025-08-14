<script>
	import MapViewer from '$lib/components/map-viewer.svelte';
	import ArcChart from '$lib/components/charts/arc-chart.svelte';

	const { data } = $props();
	const { partidas, overallProgress, kmzExists, kmzUrl, project,locations } = $derived(data);
</script>

<div class="h-full flex-1 flex-col gap-6 p-4 md:gap-8 md:p-8 md:flex">
	<!-- Header -->
	<div class="flex items-center justify-between gap-2">
		<div class="flex flex-col gap-1">
			<h2 class="text-xl font-semibold tracking-tight md:text-2xl">
				¡Bienvenido a {project.name}!
			</h2>
			<p class="text-muted-foreground">Resumen general del progreso y ubicación del proyecto.</p>
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
