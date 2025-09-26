<script lang="ts">
	import RadialChart from '$lib/components/radial-chart.svelte';
	import DownloadButton from '$lib/components/download-button.svelte';
	let { data } = $props();
	let { components, project } = $derived(data);
</script>

<div class="flex flex-1 flex-col gap-8 p-8">
	<!-- Header with Download Button -->
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-semibold">Partidas</h1>
		<DownloadButton projectName={project?.name || 'Proyecto'} tabName="Partidas" />
	</div>

	{#if !components?.length}
		<div class="flex h-[200px] items-center justify-center text-muted-foreground">
			No hay partidas para este proyecto
		</div>
	{:else}
		<div class="grid auto-rows-min gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{#each components as component (component.id)}
				<div class="h-[350px] rounded-xl">
					<RadialChart title={component.name} value={component.percent} description="" />
				</div>
			{/each}
		</div>
	{/if}
</div>


