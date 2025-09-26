<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import DownloadIcon from '@lucide/svelte/icons/download';
	import FileImageIcon from '@lucide/svelte/icons/file-image';
	import FileTextIcon from '@lucide/svelte/icons/file-text';
	import { toast } from 'svelte-sonner';

	export let className: string = '';
	export let projectName: string = '';
	export let tabName: string = '';

	async function downloadScreenshot(type: 'png' | 'pdf') {
		// Show toast notification immediately
		toast.success('Su archivo se descargará en breve automáticamente.');
		
		try {
			const currentUrl = window.location.href;
			const response = await fetch('/api/screenshot', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					url: currentUrl,
					type,
					fullPage: true,
					scale: 2
				})
			});

			if (!response.ok) {
				throw new Error('Failed to generate screenshot');
			}

			// Generate filename with project name and tab name
			const sanitizedProjectName = projectName.replace(/[^a-zA-Z0-9]/g, '_');
			const sanitizedTabName = tabName.replace(/[^a-zA-Z0-9]/g, '_');
			const filename = `${sanitizedProjectName}_${sanitizedTabName}.${type}`;

			// Create download link
			const blob = await response.blob();
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = filename;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			window.URL.revokeObjectURL(url);
		} catch (error) {
			console.error('Download failed:', error);
			toast.error('Error al descargar. Intenta de nuevo.');
		}
	}
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button
				variant="outline"
				size="sm"
				class={className}
				{...props}
			>
				<DownloadIcon class="mr-2 h-4 w-4" />
				Descargar
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end">
		<DropdownMenu.Item onclick={() => downloadScreenshot('png')}>
			<FileImageIcon class="mr-2 h-4 w-4" />
			Descargar PNG
		</DropdownMenu.Item>
		<DropdownMenu.Item onclick={() => downloadScreenshot('pdf')}>
			<FileTextIcon class="mr-2 h-4 w-4" />
			Descargar PDF
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
