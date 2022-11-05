import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';

const config: UserConfig = {
	plugins: [sveltekit()],
	define: {
		// By default, Vite doesn't include shims for NodeJS/
		// necessary for segment analytics lib to work
		global: {},
	},
};

export default config;
