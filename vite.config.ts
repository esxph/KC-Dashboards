import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import basicSsl from '@vitejs/plugin-basic-ssl';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit(), basicSsl()],

	server: {
		host: '0.0.0.0', // or use '0.0.0.0'
		port: 5174 // optional, set custom port if needed
	}
});
