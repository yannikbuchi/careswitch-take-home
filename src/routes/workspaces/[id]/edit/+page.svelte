<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import { superForm } from 'sveltekit-superforms/client';
	import { zod } from 'sveltekit-superforms/adapters';
	import { z } from 'zod';
	let { data } = $props();

	const workspaceSchema = z.object({
		name: z.string().min(1, 'First name is required'),
		description: z.string().min(1, 'Last name is required')
	});

	const { form } = superForm(
		{
			name: data.workspace?.name || '',
			description: data.workspace?.description || ''
		},
		{
			validators: zod(workspaceSchema)
		}
	);

	let workspace = data.workspace;

	let dialogOpen = $state(false);
</script>

<h1>Edit Workspace</h1>

<!-- TO DO: Add Form to edit workspace name and description -->
<h1>Editing {workspace?.name}</h1>

<form method="POST" action="?/editWorkspace">
	<div>
		<label for="name">First Name</label>
		<input id="name" name="name" bind:value={$form.name} type="text" />
	</div>
	<div>
		<label for="description">Last Name</label>
		<input id="description" name="description" bind:value={$form.description} type="text" />
	</div>
	<Button type="submit">Save Changes</Button>
</form>

<Dialog.Root>
	<Dialog.Trigger>
		<Button on:click={() => (dialogOpen = true)} variant="destructive">Delete Workspace</Button>
	</Dialog.Trigger>
	<Dialog.Overlay />
	<Dialog.Content>
		<Dialog.Title>Confirm Delete Workspace</Dialog.Title>
		<form method="POST" action="?/deleteWorkspace">
			<Dialog.Description
				>Are you sure you want to delete this workspace? This action is permanent.</Dialog.Description
			>
			<Dialog.Footer class="sm:justify-start">
				<Dialog.Close asChild>
					<Button type="submit" variant="destructive">Delete</Button>
				</Dialog.Close>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
