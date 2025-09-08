<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import PackageIcon from '@lucide/svelte/icons/package';
	import HomeIcon from '@lucide/svelte/icons/house';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import BarChart3Icon from '@lucide/svelte/icons/bar-chart-3';
	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import AppHeader from '$lib/components/app-header.svelte';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let { data, children } = $props();

	const navItems = [
		{ title: 'Inicio', url: '/', icon: ChevronRight },
		{ title: 'Partidas', url: '/partidas', icon: ChevronRight },
		{ title: 'Subpartidas', url: '/subpartidas', icon: ChevronRight },
		{ title: 'Conceptos', url: '/conceptos', icon: ChevronRight },
		{ title: 'Subconceptos', url: '/subconceptos', icon: ChevronRight },
		{ title: 'Chart Test', url: '/chart-test', icon: BarChart3Icon }
	];

	// Handle theme parameter from URL
	onMount(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const theme = urlParams.get('theme');
		
		console.log('Theme parameter found:', theme);
		
		if (theme === 'dark' || theme === 'light') {
			console.log('Setting theme to:', theme);
			
			// Use mode-watcher's setMode function to properly integrate with the theme system
			import('mode-watcher').then(({ setMode }) => {
				setMode(theme);
				console.log('Theme set via mode-watcher, waiting before redirect...');
				
				// Add a longer delay to ensure theme is applied and mode-watcher has processed it
				setTimeout(() => {
					// Check if theme was actually applied
					const htmlElement = document.documentElement;
					const hasDarkClass = htmlElement.classList.contains('dark');
					const localStorageTheme = localStorage.getItem('mode-watcher-mode');
					console.log('Current dark class:', hasDarkClass, 'localStorage theme:', localStorageTheme, 'Expected for theme:', theme);
					
					// Remove theme parameter and redirect to clean URL
					const cleanUrl = `/site/${data.project.id}`;
					console.log('Redirecting to:', cleanUrl);
					goto(cleanUrl, { replaceState: true });
				}, 1000); // Increased delay to 1 second
			});
		}
	});
</script>

<svelte:head>
	<title>{page.data.title} - {data.project.name} - CiviLog</title>
</svelte:head>

<div class="[--header-height:calc(--spacing(14))]">
	<Sidebar.Provider class="flex flex-col">
		<AppHeader title={page.data.title} project={data.project} projectList={data.projectList} />
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
