<script lang="ts">
	import Binoculars from '@lucide/svelte/icons/binoculars';
	import { Button } from '$lib/components/ui/button/index.js';
	let { data } = $props();
</script>

<!-- This page will only load if a user is not member of any project -->
<div class="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
	<div class="w-full max-w-md">
		<div class="flex flex-col items-center justify-center gap-4 rounded-md text-primary">
			<Binoculars class="size-16" />
			<span class="text-lg font-bold">Ningún proyecto encontrado</span>
			<span>
				Hola {data.profile.first_name}, no encontramos ningún proyecto asociado a tu cuenta. Favor
				de contactar a tu administrador.
			</span>
			<span>
				<a href="/auth/logout"><Button>Cerrar sesión</Button></a>
			</span>
		</div>
	</div>
</div>
