<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import { superForm } from 'sveltekit-superforms/client';
	import { zod } from 'sveltekit-superforms/adapters';
	import { z } from 'zod';
	import * as Table from '$lib/components/ui/table';
	let { data } = $props();
	let users = $state(data.users ?? []);
	let usersNotInWorkspace = $state(data.usersNotInWorkspace ?? []);

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

	const handleRemoveUser = async (userId: string) => {
		if (!workspace?.id) {
			console.error('Workspace ID is not defined.');
			return;
		}

		const form = new FormData();
		form.append('userId', userId);
		form.append('workspaceId', workspace?.id);

		const response = await fetch('?/removeUserFromWorkspace', {
			method: 'POST',
			body: form
		});

		if (response.ok) {
			const addedUser = usersNotInWorkspace.find((user) => user.id === userId);
			if (addedUser) {
				users.push({
					user: addedUser,
					workspaceId: workspace.id,
					userId: userId
				});
				usersNotInWorkspace = usersNotInWorkspace.filter((user) => user.id !== userId);
			}
			removeUserFromWorkspaceDialog = false;
		} else {
			console.error('Failed to remove user from workspace');
		}
	};

	const handleAddUserToWorkspace = async (userId: string) => {
		if (!workspace?.id) {
			console.error('Workspace ID is not defined.');
			return;
		}

		const form = new FormData();
		form.append('userId', userId);
		form.append('workspaceId', workspace?.id);

		const response = await fetch('?/addUserToWorkspace', {
			method: 'POST',
			body: form
		});

		if (response.ok) {
			users = users.filter((user) => user.userId !== userId);
			addUserToWorkspaceDialog = false;
		} else {
			console.error('Failed to remove user from workspace');
		}
	};

	let workspace = data.workspace;

	let removeUserFromWorkspaceDialog = $state(false);
	let deleteWorkspaceDialog = $state(false);
	let addUserToWorkspaceDialog = $state(false);
</script>

<h1>Edit Workspace</h1>

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

<h1>Manage Current Users</h1>

<Table.Root>
	<Table.Header>
		<Table.Row>
			<Table.Head class="w-[100px]">ID</Table.Head>
			<Table.Head>Name</Table.Head>
			<Table.Head></Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each users as user}
			<Table.Row>
				<Table.Cell class="font-medium">{user.user.id}</Table.Cell>
				<Table.Cell
					><Button variant="link" href="/users/{user.user.id}"
						>{user.user.first_name + ' ' + user.user.last_name}</Button
					></Table.Cell
				>
				<Table.Cell
					><Dialog.Root>
						<Dialog.Trigger>
							<Button on:click={() => (removeUserFromWorkspaceDialog = true)} variant="outline"
								>Remove</Button
							>
						</Dialog.Trigger>
						<Dialog.Overlay />
						<Dialog.Content>
							<Dialog.Title>Confirm Delete User</Dialog.Title>
							<Dialog.Description
								>Are you sure you want to remove {user.user.first_name + ' ' + user.user.last_name} from
								{workspace?.name}?</Dialog.Description
							>
							<Dialog.Footer class="sm:justify-start">
								<Dialog.Close asChild>
									<Button
										type="button"
										variant="outline"
										onclick={() => {
											handleRemoveUser(user.userId);
										}}>Remove</Button
									>
								</Dialog.Close>
							</Dialog.Footer>
						</Dialog.Content>
					</Dialog.Root></Table.Cell
				>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>

<Dialog.Root>
	<Dialog.Trigger>
		<Button on:click={() => (addUserToWorkspaceDialog = true)} variant="outline"
			>Add Users to {workspace?.name}</Button
		>
	</Dialog.Trigger>
	<Dialog.Overlay />
	<Dialog.Content>
		<Dialog.Title>Available Users</Dialog.Title>
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head class="w-[100px]">ID</Table.Head>
					<Table.Head>Name</Table.Head>
					<Table.Head></Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each usersNotInWorkspace as uniw}
					<Table.Row>
						<Table.Cell class="font-medium">
							{uniw.id}
						</Table.Cell>
						<Table.Cell>
							{uniw.first_name + ' ' + uniw.last_name}
						</Table.Cell>
						<Table.Cell>
							<Button
								variant="outline"
								onclick={() => {
									handleAddUserToWorkspace(uniw.id);
								}}>Add</Button
							>
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</Dialog.Content>
</Dialog.Root>

<Dialog.Root>
	<Dialog.Trigger>
		<Button on:click={() => (deleteWorkspaceDialog = true)} variant="destructive"
			>Delete Workspace</Button
		>
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
