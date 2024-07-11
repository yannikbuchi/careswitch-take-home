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

<div class="container mx-auto px-4 py-8">
	<h1 class="text-left text-4xl font-bold">{workspace?.name} > Edit</h1>

	<form method="POST" action="?/editWorkspace" class="mt-4">
		<div class="mb-4">
			<label for="name" class="block text-sm font-medium text-gray-700">Name</label>
			<input
				id="name"
				name="name"
				bind:value={$form.name}
				type="text"
				class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
			/>
		</div>
		<div class="mb-4">
			<label for="description" class="block text-sm font-medium text-gray-700">Description</label>
			<input
				id="description"
				name="description"
				bind:value={$form.description}
				type="text"
				class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
			/>
		</div>
		<Button type="submit" class="mt-4">Save Changes</Button>
	</form>

	<h2 class="mt-8 text-left text-2xl font-bold">Manage Current Users</h2>

	<div class="mt-4 overflow-hidden rounded-lg border border-gray-300">
		<Table.Root>
			<Table.Header class="bg-gray-100">
				<Table.Row>
					<Table.Head class="w-[100px] p-4">ID</Table.Head>
					<Table.Head class="p-4">Name</Table.Head>
					<Table.Head class="p-4"></Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each users as user}
					<Table.Row>
						<Table.Cell class="p-4 font-medium">{user.user.id}</Table.Cell>
						<Table.Cell class="p-4">
							<Button variant="link" href="/users/{user.user.id}">
								{user.user.first_name + ' ' + user.user.last_name}
							</Button>
						</Table.Cell>
						<Table.Cell class="p-4">
							<Dialog.Root>
								<Dialog.Trigger>
									<Button on:click={() => (removeUserFromWorkspaceDialog = true)} variant="outline">
										Remove
									</Button>
								</Dialog.Trigger>
								<Dialog.Overlay />
								<Dialog.Content>
									<Dialog.Title>Confirm Delete User</Dialog.Title>
									<Dialog.Description>
										Are you sure you want to remove {user.user.first_name +
											' ' +
											user.user.last_name} from
										{workspace?.name}?
									</Dialog.Description>
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
							</Dialog.Root>
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>

	<Dialog.Root>
		<Dialog.Trigger>
			<Button on:click={() => (addUserToWorkspaceDialog = true)} variant="outline" class="mt-4">
				Add Users to {workspace?.name}
			</Button>
		</Dialog.Trigger>
		<Dialog.Overlay />
		<Dialog.Content>
			<Dialog.Title>Available Users</Dialog.Title>
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head class="w-[100px] p-4">ID</Table.Head>
						<Table.Head class="p-4">Name</Table.Head>
						<Table.Head class="p-4"></Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each usersNotInWorkspace as user}
						<Table.Row>
							<Table.Cell class="p-4 font-medium">{user.id}</Table.Cell>
							<Table.Cell class="p-4">{user.first_name + ' ' + user.last_name}</Table.Cell>
							<Table.Cell class="p-4">
								<Button
									variant="outline"
									onclick={() => {
										handleAddUserToWorkspace(user.id);
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
			<Button on:click={() => (deleteWorkspaceDialog = true)} variant="destructive" class="mt-4">
				Delete Workspace
			</Button>
		</Dialog.Trigger>
		<Dialog.Overlay />
		<Dialog.Content>
			<Dialog.Title>Confirm Delete Workspace</Dialog.Title>
			<form method="POST" action="?/deleteWorkspace">
				<Dialog.Description>
					Are you sure you want to delete this workspace? This action is permanent.
				</Dialog.Description>
				<Dialog.Footer class="sm:justify-start">
					<Dialog.Close asChild>
						<Button type="submit" variant="destructive">Delete</Button>
					</Dialog.Close>
				</Dialog.Footer>
			</form>
		</Dialog.Content>
	</Dialog.Root>
</div>
