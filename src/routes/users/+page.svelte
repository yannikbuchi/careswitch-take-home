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
	import { toast } from 'svelte-sonner';
	import { onMount } from 'svelte';

	let { data } = $props();
	const userSchema = z.object({
		first_name: z.string().min(1, 'First name is required.'),
		last_name: z.string().min(1, 'Last name is required.')
	});

	const { form } = superForm(data.userForm, {
		validators: zod(userSchema)
	});
</script>

<div class="container mx-auto px-4 py-8">
	<div class="flex items-center space-x-2">
		<img src="/users.svg" alt="Users Icon" class="mt-2 h-7 w-7" />
		<h1 class="text-left text-4xl font-bold">Users</h1>
	</div>

	<Dialog.Root>
		<Dialog.Trigger>
			<Button.Root class="mt-4">+ Add User</Button.Root>
		</Dialog.Trigger>
		<Dialog.Overlay />
		<Dialog.Content>
			<form method="POST" action="?/addUser" use:enhance>
				<Dialog.Title>Add New User</Dialog.Title>
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
				<Dialog.Close>
					<Form.Button class="mt-4" type="submit">Submit</Form.Button>
				</Dialog.Close>
			</form>
		</Dialog.Content>
	</Dialog.Root>

	<div class="mt-4 overflow-hidden rounded-lg border border-gray-300">
		<Table.Root class="w-full">
			<Table.Header class="bg-gray-100">
				<Table.Row>
					<Table.Head class="w-[300px] p-4">ID</Table.Head>
					<Table.Head class="w-[200px] p-4">Name</Table.Head>
					<Table.Head class="mr-4 p-4 text-right"></Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#if data.users.length === 0}
					<tr>
						<td colspan="4" class="p-4 text-center text-gray-500">There are currently no users.</td>
					</tr>
				{:else}
					{#each data.users as user (user.id)}
						<Table.Row>
							<Table.Cell class="w-[300px] p-4 font-medium">{user.id}</Table.Cell>
							<Table.Cell class="w-[200px] p-4">
								<Button.Root variant="link" href="/users/{user.id}">
									{user.first_name + ' ' + user.last_name}
								</Button.Root>
							</Table.Cell>
							<Table.Cell class="mr-10 p-4 text-right">
								<a href="/users/{user.id}/edit" class="text-blue-500 hover:underline">Edit</a>
							</Table.Cell>
						</Table.Row>
					{/each}
				{/if}
			</Table.Body>
		</Table.Root>
	</div>
</div>
