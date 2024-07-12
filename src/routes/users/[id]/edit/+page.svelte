<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import { superForm } from 'sveltekit-superforms/client';
	import { zod } from 'sveltekit-superforms/adapters';
	import { z } from 'zod';
	import * as Table from '$lib/components/ui/table';
	import Badge from '$lib/components/ui/badge/badge.svelte';

	let { data } = $props();
	let workspacesInUser = $state(data.workspacesInUser ?? []);
	let workspacesNotInUser = $state(data.workspacesNotInUser ?? []);
	let addUserToWorkspaceDialog = $state(false);

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

	const handleRemoveUserFromWorkspace = async (workspaceId: string) => {
		if (!user?.id) {
			console.error('User ID is not defined.');
			return;
		}

		const form = new FormData();
		form.append('workspaceId', workspaceId);
		form.append('userId', user?.id);

		const response = await fetch('?/removeUserFromWorkspace', {
			method: 'POST',
			body: form
		});

		if (response.ok) {
			const removedWorkspace = workspacesInUser.find((workspace) => workspace.id === workspaceId);
			if (removedWorkspace) {
				workspacesInUser = workspacesInUser.filter((workspace) => workspace.id !== workspaceId);
				workspacesNotInUser = [...workspacesNotInUser, removedWorkspace];
			}
		} else {
			console.error('Failed to remove user from workspace');
		}
	};

	const handleAddUsersToWorkspace = async (workspaceId: string) => {
		if (!user?.id) {
			console.error('User ID is not defined.');
			return;
		}

		const form = new FormData();
		form.append('userId', user.id);
		form.append('workspaceId', workspaceId);

		const response = await fetch('?/addUserToWorkspace', {
			method: 'POST',
			body: form
		});

		if (response.ok) {
			const addedWorkspace = workspacesNotInUser.find((workspace) => workspace.id === workspaceId);
			if (addedWorkspace) {
				workspacesInUser = [...workspacesInUser, addedWorkspace];
				workspacesNotInUser = workspacesNotInUser.filter(
					(workspace) => workspace.id !== workspaceId
				);
			}
		} else {
			console.error('Failed to remove user from workspace');
		}
	};

	let user = data.user;
	let full_name = user?.first_name + ' ' + user?.last_name;

	let dialogOpen = $state(false);
</script>

<div class="container mx-auto px-4 py-8">
	<div class="flex space-x-2">
		<img src="/user.svg" alt="Workspace Icon" class="mt-2 h-7 w-7" />
		<h1 class="text-left text-4xl font-bold">{full_name} (Editing)</h1>
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
		<Button href="/users/{user?.id}" variant="outline">Cancel</Button>
		<Button type="submit" class="mt-4">Save Changes</Button>
	</form>

	<h2 class="mt-8 text-left text-2xl font-bold">Manage Current Workspaces</h2>
	<Dialog.Root>
		<Dialog.Trigger>
			<Button variant="outline" class="mt-4" on:click={() => (addUserToWorkspaceDialog = true)}
				>+ Add workspace</Button
			>
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
					{#each workspacesNotInUser as workspace}
						<Table.Row>
							<Table.Cell class="p-4 font-medium">{workspace.id}</Table.Cell>
							<Table.Cell class="p-4">{workspace.name}</Table.Cell>
							<Table.Cell class="p-4">
								<Button
									variant="outline"
									onclick={() => {
										handleAddUsersToWorkspace(workspace.id);
									}}>Add</Button
								>
							</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</Dialog.Content>
	</Dialog.Root>

	<div class="mt-4 overflow-hidden rounded-lg border border-gray-300">
		<Table.Root>
			<Table.Header class="bg-gray-100">
				<Table.Row>
					<Table.Head class="p-4">Name</Table.Head>
					<Table.Head class="p-4">Description</Table.Head>
					<Table.Head class="w-[100px] p-4">ID</Table.Head>
					<Table.Head class="w-[100px] p-4"></Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each workspacesInUser as workspace}
					<Table.Row>
						<Table.Cell class="p-4">
							<Button variant="link" href="/workspaces/{workspace.id}">
								{workspace.name}
							</Button>
						</Table.Cell>
						<Table.Cell class="p-4">{workspace.description}</Table.Cell>
						<Table.Cell class="p-4 font-medium"
							><Badge class="bg-blue-400">{workspace.id}</Badge></Table.Cell
						>
						<Table.Cell class="p-4">
							<Dialog.Root>
								<Dialog.Trigger>
									<Button variant="outline">Remove</Button>
								</Dialog.Trigger>
								<Dialog.Overlay />
								<Dialog.Content>
									<Dialog.Title>Confirm Delete User</Dialog.Title>
									<Dialog.Description>
										Are you sure you want to remove {user?.first_name + ' ' + user?.last_name} from {workspace.description}?
									</Dialog.Description>
									<Dialog.Footer class="sm:justify-start">
										<Dialog.Close>
											<Button
												type="button"
												variant="outline"
												onclick={() => {
													handleRemoveUserFromWorkspace(workspace.id);
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
