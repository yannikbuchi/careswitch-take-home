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

<h1>Workspaces</h1>

<Dialog.Root>
	<Dialog.Trigger>
		<Button.Root on:click={() => (dialogOpen = true)}>+ Add Workspace</Button.Root>
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
			<Form.Button>Submit</Form.Button>
		</form>
	</Dialog.Content>
</Dialog.Root>

<Table.Root>
	<Table.Header>
		<Table.Row>
			<Table.Head class="w-[100px]">ID</Table.Head>
			<Table.Head>Name</Table.Head>
			<Table.Head>Description</Table.Head>
			<Table.Head></Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each data.workspaces as workspace (workspace.id)}
			<Table.Row>
				<Table.Cell class="font-medium">{workspace.id}</Table.Cell>
				<Table.Cell
					><Button.Root variant="link" href={`/workspaces/${workspace.id}`}
						>{workspace.name}</Button.Root
					></Table.Cell
				>
				<Table.Cell>{workspace.description}</Table.Cell>
				<Table.Cell><a href="/workspaces/{workspace.id}/edit">Edit</a></Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
