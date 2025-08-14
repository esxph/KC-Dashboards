<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import PackageIcon from '@lucide/svelte/icons/package';
	import HomeIcon from '@lucide/svelte/icons/house';
	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import AppHeader from '$lib/components/app-header.svelte';
    import { page } from '$app/state';

    let { data, children } = $props();

	const navItems = [
		{ title: 'Inicio', url: '/', icon: HomeIcon },
		{ title: 'Partidas', url: '/partidas', icon: PackageIcon },
		{ title: 'Subpartidas', url: '/subpartidas', icon: PackageIcon },
		{ title: 'Conceptos', url: '/conceptos', icon: PackageIcon },
		{ title: 'Subconceptos', url: '/subconceptos', icon: PackageIcon }
	];
</script>

<svelte:head>
	<title>{page.data.title} - {data.project.name} - CiviLog</title>
</svelte:head>

<div class="[--header-height:calc(--spacing(14))]">
	<Sidebar.Provider class="flex flex-col">
		<AppHeader title={page.data.title} project={data.project} />
		<div class="flex flex-1">
			<AppSidebar
				{navItems}
				profile={data.profile}
				currentPage="Testing"
				projectList={data.projectList}
				project={data.project}
			/>
			<Sidebar.Inset>
				<div class="flex flex-1 flex-col gap-4 p-4">
					{@render children?.()}
				</div>
			</Sidebar.Inset>
		</div>
	</Sidebar.Provider>
</div>
