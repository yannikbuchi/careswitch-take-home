<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Button from '$lib/components/ui/button';
	import { superForm } from 'sveltekit-superforms/client';
	import * as Form from '$lib/components/ui/form';
	import { enhance } from '$app/forms';
	import Input from '$lib/components/ui/input/input.svelte';
	import { zod } from 'sveltekit-superforms/adapters';
	import { z } from 'zod';

	let { data } = $props();

	const workspaceSchema = z.object({
		name: z.string().min(1, 'Name is required.'),
		description: z.string().min(1, 'Description is required.')
	});

	const { form } = superForm(data.workspaceForm, {
		validators: zod(workspaceSchema)
	});

	let dialogOpen = $state(false);
</script>

<div class="container mx-auto px-4 py-8">
	<div class="flex items-center space-x-2">
		<img src="/workspace.svg" alt="Workspace Icon" class="mt-2 h-7 w-7" />
		<h1 class="text-left text-4xl font-bold">Workspaces</h1>
	</div>

	<Dialog.Root>
		<Dialog.Trigger>
			<Button.Root on:click={() => (dialogOpen = true)} class="mt-4">+ Add Workspace</Button.Root>
		</Dialog.Trigger>
		<Dialog.Overlay />
		<Dialog.Content>
			<Dialog.Title>Add New Workspace</Dialog.Title>
			<form method="POST" action="?/addWorkspace" use:enhance>
				<Form.Field {form} name="name">
					<Form.Control let:attrs>
						<Form.Label>Name</Form.Label>
						<Input id="name" name="name" type="text" bind:value={$form.name} />
					</Form.Control>
				</Form.Field>
				<Form.Field {form} name="description">
					<Form.Control let:attrs>
						<Form.Label>Description</Form.Label>
						<Input id="description" name="description" type="text" bind:value={$form.description} />
					</Form.Control>
				</Form.Field>
				<Form.Button class="mt-4">Submit</Form.Button>
			</form>
		</Dialog.Content>
	</Dialog.Root>

	<div class="mt-4 overflow-hidden rounded-lg border border-gray-300">
		<Table.Root>
			<Table.Header class="bg-gray-100">
				<Table.Row>
					<Table.Head class="w-[100px] p-4">ID</Table.Head>
					<Table.Head class="p-4">Name</Table.Head>
					<Table.Head class="p-4">Description</Table.Head>
					<Table.Head class="p-4"></Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each data.workspaces as workspace (workspace.id)}
					<Table.Row>
						<Table.Cell class="p-4 font-medium">{workspace.id}</Table.Cell>
						<Table.Cell class="p-4">
							<Button.Root variant="link" href={`/workspaces/${workspace.id}`}>
								{workspace.name}
							</Button.Root>
						</Table.Cell>
						<Table.Cell class="p-4">{workspace.description}</Table.Cell>
						<Table.Cell class="p-4">
							<a href={`/workspaces/${workspace.id}/edit`} class="text-blue-500 hover:underline"
								>Edit</a
							>
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
</div>
