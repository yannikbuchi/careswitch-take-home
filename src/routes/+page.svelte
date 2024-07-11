<script>
	import Button from '$lib/components/ui/button/button.svelte';
	let { data } = $props();
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="text-left text-4xl font-bold">Home</h1>
	<h2 class="mt-4 text-left text-2xl font-bold">Welcome!</h2>

	<p class="mt-6 text-center text-lg">Get started by choosing from the options below.</p>

	<div class="mt-8 flex justify-center space-x-4">
		<Button
			href="/users"
			variant="secondary"
			class="flex h-40 w-40 items-center justify-center text-lg"
		>
			Users ({data.userCount})
		</Button>
		<Button
			href="/workspaces"
			variant="secondary"
			class="flex h-40 w-40 items-center justify-center text-lg"
		>
			Workspaces ({data.workspaceCount})
		</Button>
	</div>
</div>
