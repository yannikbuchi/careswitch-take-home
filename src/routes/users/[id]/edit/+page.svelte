<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import { superForm } from 'sveltekit-superforms/client';
	import { zod } from 'sveltekit-superforms/adapters';
	import { z } from 'zod';
	import Badge from '$lib/components/ui/badge/badge.svelte';

	let { data } = $props();

	const userSchema = z.object({
		first_name: z.string().min(1, 'First name is required'),
		last_name: z.string().min(1, 'Last name is required')
	});

	const { form } = superForm(
		{
			first_name: data.user?.first_name || '',
			last_name: data.user?.last_name || ''
		},
		{
			validators: zod(userSchema)
		}
	);

	let user = data.user;
	let full_name = user?.first_name + ' ' + user?.last_name;

	let dialogOpen = $state(false);
</script>

<div class="container mx-auto px-4 py-8">
	<div class="flex items-center space-x-2">
		<h1 class="text-left text-4xl font-bold">{full_name} (Editing)</h1>
		<Badge class="ml-2 mt-2">User</Badge>
	</div>

	<form method="POST" action="?/editUser" class="mt-4">
		<div class="mb-4 w-[300px]">
			<label for="first_name" class="block text-sm font-medium text-gray-700">First Name</label>
			<input
				id="first_name"
				name="first_name"
				bind:value={$form.first_name}
				type="text"
				class="mt-1 block w-full rounded-md border-gray-400 bg-gray-100 p-2.5 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
			/>
		</div>
		<div class="mb-4 w-[300px]">
			<label for="last_name" class="block text-sm font-medium text-gray-700">Last Name</label>
			<input
				id="last_name"
				name="last_name"
				bind:value={$form.last_name}
				type="text"
				class="mt-1 block w-full rounded-md border-gray-400 bg-gray-100 p-2.5 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
			/>
		</div>
		<Button href="/users" variant="outline">Cancel</Button>
		<Button type="submit" class="mt-4">Save Changes</Button>
	</form>

	<Dialog.Root>
		<Dialog.Trigger>
			<Button on:click={() => (dialogOpen = true)} variant="destructive" class="mt-4"
				>Delete User</Button
			>
		</Dialog.Trigger>
		<Dialog.Overlay />
		<Dialog.Content>
			<Dialog.Title>Confirm Delete User</Dialog.Title>
			<form method="POST" action="?/deleteUser">
				<Dialog.Description>
					Are you sure you want to delete this user? This action is permanent.
				</Dialog.Description>
				<Dialog.Footer class="sm:justify-start">
					<Dialog.Close asChild>
						<Button type="submit" variant="destructive" class="mt-4">Delete</Button>
					</Dialog.Close>
				</Dialog.Footer>
			</form>
		</Dialog.Content>
	</Dialog.Root>
</div>
