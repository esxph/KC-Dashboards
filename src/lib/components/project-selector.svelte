<script lang="ts">
	import FolderIcon from '@lucide/svelte/icons/folder';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';

	let { projectList, project } = $props();
</script>

<div class="flex items-center">
	<DropdownMenu.Root>
		<DropdownMenu.Trigger>
			{#snippet child({ props })}
				<Button
					variant="outline"
					size="sm"
					class="h-9 gap-2 px-2 max-w-[220px] overflow-hidden"
					{...props}
				>
					<FolderIcon class="size-4 shrink-0" />
					<span class="truncate text-sm font-medium">{project.name}</span>
					<ChevronDownIcon class="size-4 shrink-0" />
				</Button>
			{/snippet}
		</DropdownMenu.Trigger>
		<DropdownMenu.Content class="w-64 rounded-lg" align="start" side="bottom" sideOffset={4}>
			<DropdownMenu.Label class="text-xs text-muted-foreground"
				>Seleccionar proyecto</DropdownMenu.Label
			>
			{#each projectList as project (project.id)}
				<a href="/site/{project.id}" data-sveltekit-reload data-sveltekit-preload-data="off">
					<DropdownMenu.Item class="gap-2 p-2" style="cursor: pointer;">
						<div class="flex flex-col gap-1">
							<span class="text-sm font-medium">{project.name}</span>
							{#if project.description}
								<span class="text-xs text-muted-foreground">{project.description}</span>
							{/if}
						</div>
					</DropdownMenu.Item>
				</a>
			{/each}
		</DropdownMenu.Content>
	</DropdownMenu.Root>
</div>
