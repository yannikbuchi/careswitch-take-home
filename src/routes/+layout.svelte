<script>
	import { page } from '$app/stores';
	import { ModeWatcher } from 'mode-watcher';
	import '../app.css';

	let isHomeActive = false;
	let isUsersActive = false;
	let isWorkspacesActive = false;

	$: {
		const path = $page.url.pathname;
		isHomeActive = path === '/';
		isUsersActive = path.startsWith('/users');
		isWorkspacesActive = path.startsWith('/workspaces');
	}
</script>

<ModeWatcher />

<nav class="bg-gray-200 p-4">
	<div class="container mx-auto flex justify-start space-x-4">
		<a
			href="/"
			class={isHomeActive ? 'font-bold text-gray-800' : 'text-gray-800 hover:text-gray-600'}>Home</a
		>
		<a
			href="/users"
			class={isUsersActive ? 'font-bold text-gray-800' : 'text-gray-800 hover:text-gray-600'}
			>Users</a
		>
		<a
			href="/workspaces"
			class={isWorkspacesActive ? 'font-bold text-gray-800' : 'text-gray-800 hover:text-gray-600'}
			>Workspaces</a
		>
		<a href="/instructions" class="text-gray-800 hover:text-gray-600">Takehome Instructions</a>
	</div>
</nav>

<slot />
