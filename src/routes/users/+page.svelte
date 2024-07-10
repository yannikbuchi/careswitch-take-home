<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Button from '$lib/components/ui/button';
	import { superForm } from 'sveltekit-superforms';

	let { data } = $props();
	const { form } = superForm(data.form);
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
		<form method="POST" action="?/addUser">
			<div>
				<label for="first_name">First Name</label>
				<input id="first_name" name="first_name" type="text" />
			</div>
			<div>
				<label for="last_name">Last Name</label>
				<input id="last_name" name="last_name" type="text" />
			</div>
			<Button.Root type="submit">Submit</Button.Root>
		</form>
	</Dialog.Content>
</Dialog.Root>

<Table.Root>
	<Table.Header>
		<Table.Row>
			<Table.Head class="w-[100px]">ID</Table.Head>
			<Table.Head>First Name</Table.Head>
			<Table.Head>Last Name</Table.Head>
			<Table.Head></Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each data.users as user (user.id)}
			<Table.Row>
				<Table.Cell class="font-medium">{user.id}</Table.Cell>
				<Table.Cell>{user.first_name}</Table.Cell>
				<Table.Cell>{user.last_name}</Table.Cell>
				<Table.Cell><a href="/users/{user.id}/edit">Edit</a></Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
