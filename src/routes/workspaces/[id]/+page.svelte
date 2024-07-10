<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	let { data } = $props();
	let workspace = $state(data.workspace);
	let users = $state(data.users ?? []);

	let dialogOpen = $state(false);

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
			users = users.filter((user) => user.userId !== userId);
			dialogOpen = false;
		} else {
			console.error('Failed to remove user from workspace');
		}
	};
</script>

<h1>{workspace?.name}</h1>
<p>{workspace?.description}</p>

<h1>Users</h1>

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
							<Button on:click={() => (dialogOpen = true)} variant="outline">Remove</Button>
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
