<script>
	import Button from '$lib/components/ui/button/button.svelte';
	let { data } = $props();
	let workspace = data.workspace;
</script>

<h1>Edit Workspace</h1>

<!-- TO DO: Add Form to edit workspace name and description -->
<h1>{workspace?.name}</h1>

<Button variant="destructive">Delete Workspace</Button>
