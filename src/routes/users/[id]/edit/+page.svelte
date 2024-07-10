<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import { superForm } from 'sveltekit-superforms/client';
	import { zod } from 'sveltekit-superforms/adapters';
	import { z } from 'zod';

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

<h1>Editing User {full_name}</h1>

<form method="POST" action="?/editUser">
	<div>
		<label for="first_name">First Name</label>
		<input id="first_name" name="first_name" bind:value={$form.first_name} type="text" />
	</div>
	<div>
		<label for="last_name">Last Name</label>
		<input id="last_name" name="last_name" bind:value={$form.last_name} type="text" />
	</div>
	<Button type="submit">Save Changes</Button>
</form>

<Dialog.Root>
	<Dialog.Trigger>
		<Button on:click={() => (dialogOpen = true)} variant="destructive">Delete User</Button>
	</Dialog.Trigger>
	<Dialog.Overlay />
	<Dialog.Content>
		<Dialog.Title>Confirm Delete User</Dialog.Title>
		<form method="POST" action="?/deleteUser">
			<Dialog.Description
				>Are you sure you want to delete this user? This action is permanent.</Dialog.Description
			>
			<Dialog.Footer class="sm:justify-start">
				<Dialog.Close asChild>
					<Button type="submit" variant="destructive">Delete</Button>
				</Dialog.Close>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
