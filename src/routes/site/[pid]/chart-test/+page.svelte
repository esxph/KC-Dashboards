<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import BarChart from '$lib/components/bar-chart.svelte';

	let { data } = $props();
	let { chartData, chartConfig, title } = $derived(data);

	// Helper function to format numbers
	const formatNumber = (value: number) => value.toLocaleString();
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<div class="flex flex-1 flex-col gap-8 p-8">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<h1 class="text-3xl font-bold tracking-tight">{title}</h1>
		<div class="text-sm text-muted-foreground">
			Testing the new bar chart component
		</div>
	</div>

	<!-- Summary Cards -->
	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
		<Card.Root class="p-4">
			<Card.Title class="text-sm font-medium text-muted-foreground">Total Data Points</Card.Title>
			<Card.Content class="p-0">
				<div class="text-2xl font-bold">{chartData?.length || 0}</div>
			</Card.Content>
		</Card.Root>

		<Card.Root class="p-4">
			<Card.Title class="text-sm font-medium text-muted-foreground">Avg Planeada</Card.Title>
			<Card.Content class="p-0">
				<div class="text-2xl font-bold">
					{formatNumber(chartData?.length ? Math.round(chartData.reduce((sum, item) => sum + item.desktop, 0) / chartData.length) : 0)}
				</div>
			</Card.Content>
		</Card.Root>

		<Card.Root class="p-4">
			<Card.Title class="text-sm font-medium text-muted-foreground">Avg Real</Card.Title>
			<Card.Content class="p-0">
				<div class="text-2xl font-bold">
					{formatNumber(chartData?.length ? Math.round(chartData.reduce((sum, item) => sum + item.real, 0) / chartData.length) : 0)}
				</div>
			</Card.Content>
		</Card.Root>

		<Card.Root class="p-4">
			<Card.Title class="text-sm font-medium text-muted-foreground">Peak Planeada</Card.Title>
			<Card.Content class="p-0">
				<div class="text-2xl font-bold">
					{formatNumber(chartData?.length ? Math.max(...chartData.map(item => item.planeada)) : 0)}
				</div>
			</Card.Content>
		</Card.Root>
	</div>

	<!-- Main Chart Section -->
	<div class="grid gap-4 md:grid-cols-1">
		<Card.Root class="p-6">
			<Card.Header>
				<Card.Title>Planeada vs Real Usage</Card.Title>
				<Card.Description>
					Monthly comparison of planeada and real user engagement metrics
				</Card.Description>
			</Card.Header>
			<Card.Content>
				{#if chartData && chartConfig}
					<BarChart data={chartData} />
				{:else}
					<div class="flex h-[200px] items-center justify-center text-muted-foreground">
						No chart data available
					</div>
				{/if}
			</Card.Content>
		</Card.Root>
	</div>

	<!-- Raw Data Table -->
	{#if chartData?.length}
		<Card.Root class="p-6">
			<Card.Header>
				<Card.Title>Raw Data</Card.Title>
				<Card.Description>
					Complete dataset used for the chart above
				</Card.Description>
			</Card.Header>
			<Card.Content>
				<div class="overflow-x-auto">
					<table class="w-full text-sm">
						<thead>
							<tr class="border-b">
								<th class="text-left p-2 font-medium">Month</th>
								<th class="text-right p-2 font-medium">Planeada</th>
								<th class="text-right p-2 font-medium">Real</th>
								<th class="text-right p-2 font-medium">Total</th>
							</tr>
						</thead>
						<tbody>
							{#each chartData as item (item.month)}
								<tr class="border-b hover:bg-muted/50">
									<td class="p-2 font-medium">{item.month}</td>
									<td class="p-2 text-right">{formatNumber(item.planeada)}</td>
									<td class="p-2 text-right">{formatNumber(item.real)}</td>
									<td class="p-2 text-right font-medium">{formatNumber(item.planeada + item.real)}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</Card.Content>
		</Card.Root>
	{/if}
</div>
