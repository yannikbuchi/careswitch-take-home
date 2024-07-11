<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	let { data } = $props();
	let workspace = $state(data.workspace);
	let users = $state(data.users ?? []);

	let dialogOpen = $state(false);
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="text-left text-4xl font-bold">{workspace?.name}</h1>
	<Button href="/workspaces/{workspace?.id}/edit" class="mt-4">Edit Workspace</Button>
	<p class="mt-4 text-left text-lg">{workspace?.description}</p>

	<h3 class="mt-8 text-left text-3xl font-bold">Current Users</h3>

	<div class="mt-4 overflow-hidden rounded-lg border border-gray-300">
		<Table.Root>
			<Table.Body>
				{#if users.length === 0}
					<tr>
						<td colspan="2" class="p-4 text-center text-gray-500"
							>There are currently no users in this workspace.</td
						>
					</tr>
				{:else}
					{#each users as user}
						<Table.Row>
							<Table.Cell class="p-4 font-medium">{user.user.id}</Table.Cell>
							<Table.Cell class="p-4">
								<Button variant="link" href="/users/{user.user.id}">
									{user.user.first_name + ' ' + user.user.last_name}
								</Button>
							</Table.Cell>
						</Table.Row>
					{/each}
				{/if}
			</Table.Body>
		</Table.Root>
	</div>
</div>
