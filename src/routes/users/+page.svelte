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
	const userSchema = z.object({
		first_name: z.string().min(1, 'First name is required.'),
		last_name: z.string().min(1, 'Last name is required.')
	});

	const { form } = superForm(data.userForm, {
		validators: zod(userSchema)
	});

	let dialogOpen = $state(false);
</script>

<h1>Users</h1>
<Dialog.Root>
	<Dialog.Trigger>
		<Button.Root on:click={() => (dialogOpen = true)}>+ Add User</Button.Root>
	</Dialog.Trigger>
	<Dialog.Overlay />
	<Dialog.Content>
		<Dialog.Title>Add New User</Dialog.Title>
		<form method="POST" action="?/addUser" use:enhance>
			<Form.Field {form} name="first_name">
				<Form.Control let:attrs>
					<Form.Label>First Name</Form.Label>
					<Input id="first_name" name="first_name" type="text" bind:value={$form.first_name} />
				</Form.Control>
			</Form.Field>
			<Form.Field {form} name="last_name">
				<Form.Control let:attrs>
					<Form.Label>Last Name</Form.Label>
					<Input id="last_name" name="last_name" type="text" bind:value={$form.last_name} />
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
			<Table.Head></Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each data.users as user (user.id)}
			<Table.Row>
				<Table.Cell class="font-medium">{user.id}</Table.Cell>
				<Table.Cell
					><Button.Root variant="link" href="/users/{user.id}"
						>{user.first_name + ' ' + user.last_name}</Button.Root
					></Table.Cell
				>
				<Table.Cell><a href="/users/{user.id}/edit">Edit</a></Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
