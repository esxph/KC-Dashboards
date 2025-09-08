<script lang="ts">
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import SunIcon from '@lucide/svelte/icons/sun';
	import MoonIcon from '@lucide/svelte/icons/moon';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import ProjectSelector from '$lib/components/project-selector.svelte';
	import { toggleMode } from 'mode-watcher';
	import {
		Breadcrumb,
		BreadcrumbItem,
		BreadcrumbLink,
		BreadcrumbList,
		BreadcrumbPage,
		BreadcrumbSeparator
	} from '$lib/components/ui/breadcrumb';

	let { project, title, projectList } = $props();
</script>

<header class="sticky top-0 z-50 flex w-full items-center border-b bg-background">
	<div class="flex h-(--header-height) w-full items-center gap-4 px-4">
		<Sidebar.Trigger class="-ml-1" />
		<Separator orientation="vertical" class="data-[orientation=vertical]:h-4" />
		<a
			href={`/site/${project.id}`}
			class="text-lg font-bold"
			aria-label="Ir al inicio del proyecto"
		>
			CiviLog <span class="text-sm font-medium text-muted-foreground">Dashboards</span>
		</a>
		
		<Separator orientation="vertical" class="data-[orientation=vertical]:h-4" />
        <Breadcrumb class="hidden sm:block">
			<BreadcrumbList>
				<BreadcrumbItem>
					<BreadcrumbLink href="/site/{project.id}">{project.name}</BreadcrumbLink> 
					<BreadcrumbSeparator />
					<BreadcrumbPage>{title}</BreadcrumbPage>
				</BreadcrumbItem>
			</BreadcrumbList>
        </Breadcrumb>

		<Button onclick={() => toggleMode()} variant="outline" size="icon" class=" sm:ml-auto">
			<SunIcon
				class="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 !transition-all dark:scale-0 dark:-rotate-90"
			/>
			<MoonIcon
				class="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 !transition-all dark:scale-100 dark:rotate-0"
			/>
			<span class="sr-only">Toggle theme</span>
		</Button>
	</div>
</header>
