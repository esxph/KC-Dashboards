<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import CircleUserIcon from '@lucide/svelte/icons/circle-user';
	import { toast } from 'svelte-sonner';
	import ProjectSelector from '$lib/components/project-selector.svelte';
	const sidebar = Sidebar.useSidebar();

	let { navItems, profile, currentPage, projectList, project } = $props();
</script>

<Sidebar.Root class="top-(--header-height) h-[calc(100svh-var(--header-height))]!">
	
	<Sidebar.Header>
		<div class="flex flex-col items-center">
			<h2 class="mb-1 pt-2 text-xs font-semibold text-muted-foreground tracking-tight">
				Proyecto Actual
			</h2>
			<ProjectSelector {projectList} {project} />
		</div>
		<Sidebar.Separator class="mt-1" />
		<h2 class="pt-2 pl-2 text-m font-semibold tracking-tight">
			Páginas
		</h2>
	</Sidebar.Header>
	
	<Sidebar.Content>
		<Sidebar.Group>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					{#each navItems as item (item.title)}
						<Sidebar.MenuItem>
							{#if item.title == currentPage}
								<Sidebar.MenuButton isActive>
									{#snippet child({ props })}
								<a href={item.url} data-sveltekit-preload-data="hover" data-sveltekit-preload-code="hover" {...props}>
											<item.icon />
											<span>{item.title}</span>
										</a>
									{/snippet}
								</Sidebar.MenuButton>
							{:else}
								<Sidebar.MenuButton>
									{#snippet child({ props })}
								<a href={'/site/' + project.id + item.url} data-sveltekit-preload-data="hover" data-sveltekit-preload-code="hover" {...props}>
											<item.icon />
											<span>{item.title}</span>
										</a>
									{/snippet}
								</Sidebar.MenuButton>
							{/if}
						</Sidebar.MenuItem>
					{/each}
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Content>
	<Sidebar.Footer>
		<!-- User Menu -->
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						{#snippet child({ props })}
							<Sidebar.MenuButton
								size="lg"
								class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
								{...props}
							>
								<Avatar.Root class="size-8 rounded-lg">
									<Avatar.Fallback class="rounded-lg"><CircleUserIcon /></Avatar.Fallback>
								</Avatar.Root>
								<div class="grid flex-1 text-left text-sm leading-tight">
									<span class="truncate font-medium">{profile.first_name} {profile.last_name}</span>
									<span class="truncate text-xs">{profile.email}</span>
								</div>
								<ChevronsUpDownIcon class="ml-auto size-4" />
							</Sidebar.MenuButton>
						{/snippet}
					</DropdownMenu.Trigger>
					<DropdownMenu.Content
						class="w-(--bits-dropdown-menu-anchor-width) min-w-56 rounded-lg"
						align="start"
						side={sidebar.isMobile ? 'bottom' : 'right'}
						sideOffset={4}
					>
						<DropdownMenu.Label class="p-0 font-normal">
							<div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
								<div class="grid flex-1 text-left text-sm leading-tight">
									<span class="truncate font-medium">{profile.first_name} {profile.last_name}</span>
									<span class="truncate text-xs">{profile.email}</span>
								</div>
							</div>
						</DropdownMenu.Label>
						<DropdownMenu.Separator />
						<a href="/auth/logout" data-sveltekit-preload-data="off">
							<DropdownMenu.Item>Cerrar sesión</DropdownMenu.Item>
						</a>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Footer>
</Sidebar.Root>
