<script lang="ts">
	import ArcChart from '$lib/components/charts/arc-chart.svelte';
	let { data } = $props();
	let { components } = $derived(data);
</script>

<div class="flex flex-1 flex-col gap-8 p-8">
	{#if !components?.length}
		<div class="flex h-[200px] items-center justify-center text-muted-foreground">
			No hay conceptos para este proyecto
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


