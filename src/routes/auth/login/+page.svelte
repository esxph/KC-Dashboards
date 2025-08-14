<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import SunIcon from '@lucide/svelte/icons/sun';
	import MoonIcon from '@lucide/svelte/icons/moon';
	import { toggleMode } from 'mode-watcher';
	import type { ActionData } from './$types';

	export let form: ActionData;
</script>

<svelte:head>
	<title>Login to App</title>
</svelte:head>

<form method="POST" action="?/login">
	<div class="flex h-screen w-full items-center justify-center px-4">
		<Card.Root class="w-full max-w-sm">
			<Card.Header>
				<h1 class="text-4xl font-bold text-center mb-4">CiviLog</h1>
				<Card.Title>Inicio de sesión</Card.Title>
				<Card.Description>Ingresa tus datos para continuar</Card.Description>
				<Card.Action>
					<Button onclick={toggleMode} variant="outline" size="icon" class=" sm:ml-auto">
						<SunIcon
							class="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 !transition-all dark:scale-0 dark:-rotate-90"
						/>
						<MoonIcon
							class="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 !transition-all dark:scale-100 dark:rotate-0"
						/>
					</Button>
				</Card.Action>
			</Card.Header>
			<Card.Content>
				<div class="flex flex-col gap-6">
					{#if form?.error}
						<div class="text-red-600 text-sm font-medium text-center">
							{form.error}
						</div>
					{/if}
					<div class="grid gap-2">
						<Label for="email">Correo electrónico</Label>
						<Input id="email" name="email" type="email" placeholder="m@example.com" required />
					</div>
					<div class="grid gap-2">
						<div class="flex items-center">
							<Label for="password">Contraseña</Label>
						</div>
						<Input id="password" name="password" type="password"  placeholder="****" required />
					</div>
				</div>
			</Card.Content>
			<Card.Footer class="flex-col gap-2">
				<Button type="submit" formaction="?/login" class="w-full">Iniciar sesión</Button>
			</Card.Footer>
		</Card.Root>
	</div>
</form>
