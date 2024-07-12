<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import { superForm } from 'sveltekit-superforms/client';
	import { zod } from 'sveltekit-superforms/adapters';
	import { z } from 'zod';
	import * as Table from '$lib/components/ui/table';
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';

	let { data } = $props();
	let usersInWorkspace = $state(data.usersInWorkspace ?? []);
	let usersNotInWorkspace = $state(data.usersNotInWorkspace ?? []);
	let workspace = data.workspace;

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

	const handleRemoveUserFromWorkspace = async (userId: string) => {
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
			const removedUser = usersInWorkspace.find((user) => user.id === userId);
			if (removedUser) {
				usersNotInWorkspace = [...usersNotInWorkspace, removedUser];
				usersInWorkspace = usersInWorkspace.filter((user) => user.id !== userId);
			}
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
			const addedUser = usersNotInWorkspace.find((user) => user.id === userId);
			if (addedUser) {
				usersNotInWorkspace = usersNotInWorkspace.filter((user) => user.id !== userId);
				usersInWorkspace = [...usersInWorkspace, addedUser];
			}
		} else {
			console.error('Failed to remove user from workspace');
		}
	};

	const handleDeleteWorkspace = async () => {
		const form = new FormData();

		if (!workspace?.id) {
			console.error('Workspace ID is not defined.');
			return;
		}
		form.append('worspaceId', workspace?.id);

		const response = await fetch('?/deleteWorkspace', {
			method: 'POST',
			body: form
		});

		if (response.ok) {
			await goto('/workspaces');
		} else {
			console.error('Failed to delete workspace');
		}
	};
</script>

<div class="container mx-auto px-4 py-8">
	<div class="flex space-x-2">
		<img src="/workspace.svg" alt="Workspace Icon" class="mt-2 h-7 w-7" />
		<h1 class="text-left text-4xl font-bold">{workspace?.name} (Editing)</h1>
	</div>

	<form method="POST" action="?/editWorkspace" class="mt-4">
		<div class="mb-4 w-[300px]">
			<label for="name" class="block text-sm font-medium text-gray-700">Name</label>
			<input
				id="name"
				name="name"
				bind:value={$form.name}
				type="text"
				class="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 p-2.5 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
			/>
		</div>
		<div class="mb-4">
			<label for="description" class="block text-sm font-medium text-gray-700">Description</label>
			<input
				id="description"
				name="description"
				bind:value={$form.description}
				type="text"
				class="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 p-2.5 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
			/>
		</div>
		<Button href="/workspaces/{workspace?.id}" variant="outline">Cancel</Button>
		<Button type="submit" class="mt-4">Save Changes</Button>
	</form>

	<h2 class="mt-8 text-left text-2xl font-bold">Manage Current Users</h2>
	<Dialog.Root>
		<Dialog.Trigger>
			<Button variant="outline" class="mt-4">
				+ Add Users to {workspace?.name}
			</Button>
		</Dialog.Trigger>
		<Dialog.Overlay />
		<Dialog.Content>
			<Dialog.Title>Available Users</Dialog.Title>
			{#if usersNotInWorkspace.length === 0}
				<p>There are currently no users to add to this workspace.</p>
			{:else}
				<Table.Root>
					<Table.Header>
						<Table.Row>
							<Table.Head class="p-4">Name</Table.Head>
							<Table.Head class="p-4"></Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#each usersNotInWorkspace as user}
							<Table.Row>
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
			{/if}
		</Dialog.Content>
	</Dialog.Root>
	{#if usersInWorkspace.length === 0}
		<p>There are currently no users in this workspace.</p>
	{:else}
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
					{#each usersInWorkspace as user}
						<Table.Row>
							<Table.Cell class="p-4 font-medium">{user.id}</Table.Cell>
							<Table.Cell class="p-4">
								<Button variant="link" href="/users/{user.id}">
									{user.first_name + ' ' + user.last_name}
								</Button>
							</Table.Cell>
							<Table.Cell class="p-4">
								<Dialog.Root>
									<Dialog.Trigger>
										<Button variant="outline">Remove</Button>
									</Dialog.Trigger>
									<Dialog.Overlay />
									<Dialog.Content>
										<Dialog.Title>Confirm Delete User</Dialog.Title>
										<Dialog.Description>
											Are you sure you want to remove {user.first_name + ' ' + user.last_name} from
											{workspace?.name}?
										</Dialog.Description>
										<Dialog.Footer class="sm:justify-start">
											<Dialog.Close>
												<Button
													type="button"
													variant="outline"
													onclick={() => {
														handleRemoveUserFromWorkspace(user.id);
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
	{/if}
	<Dialog.Root>
		<Dialog.Trigger>
			<Button variant="destructive" class="mt-4">Delete Workspace</Button>
		</Dialog.Trigger>
		<Dialog.Overlay />
		<Dialog.Content>
			<Dialog.Title>Confirm Delete Workspace</Dialog.Title>
			<Dialog.Description>
				Are you sure you want to delete this workspace? This action is permanent.
			</Dialog.Description>
			<Dialog.Footer class="sm:justify-start">
				<Dialog.Close>
					<Button type="button" variant="destructive" class="mt-4" on:click={handleDeleteWorkspace}
						>Delete</Button
					>
				</Dialog.Close>
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Root>
</div>
