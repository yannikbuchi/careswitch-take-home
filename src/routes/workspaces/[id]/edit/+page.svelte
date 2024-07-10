<script>
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import DialogDescription from '$lib/components/ui/dialog/dialog-description.svelte';
	let { data } = $props();
	let workspace = data.workspace;

	let dialogOpen = $state(false);
</script>

<h1>Edit Workspace</h1>

<!-- TO DO: Add Form to edit workspace name and description -->
<h1>{workspace?.name}</h1>

<Dialog.Root>
	<Dialog.Trigger>
		<Button on:click={() => (dialogOpen = true)} variant="destructive">Delete Workspace</Button>
	</Dialog.Trigger>
	<Dialog.Overlay />
	<Dialog.Content>
		<Dialog.Title>Confirm Delete Workspace</Dialog.Title>
		<DialogDescription
			>Are you sure you want to delete this workspace? This action is permanent.</DialogDescription
		>
		<Dialog.Footer class="sm:justify-start">
			<Dialog.Close asChild>
				<Button type="button" variant="secondary">Delete</Button>
			</Dialog.Close>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
