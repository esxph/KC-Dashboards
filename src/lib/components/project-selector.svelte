<script lang="ts">
	import FolderIcon from '@lucide/svelte/icons/folder';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';

	let { projectList, project } = $props();
</script>

<Sidebar.Menu>
	<Sidebar.MenuItem>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Sidebar.MenuButton class="data-[state=open]:bg-sidebar-accent" size="lg" {...props}>
						<FolderIcon />
						<div class="flex w-max flex-col">
							<span class="text-xs text-muted-foreground">Proyecto actual</span>
							<span class="truncate font-medium">{project.name}</span>
						</div>
						<ChevronDownIcon class="ml-auto size-4" />
					</Sidebar.MenuButton>
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
	</Sidebar.MenuItem>
</Sidebar.Menu>
