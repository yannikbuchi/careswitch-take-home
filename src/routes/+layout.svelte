<script>
	import { ModeWatcher } from 'mode-watcher';
	import '../app.css';

	// let { children } = $props();
</script>

<ModeWatcher />

<!-- {@render children()} -->

<nav>
	<a href="/">Home</a>
	<a href="/users">Users</a>
	<a href="/workspaces">Workspaces</a>
	<a href="/instructions">Takehome Instructions</a>
</nav>

<slot />
