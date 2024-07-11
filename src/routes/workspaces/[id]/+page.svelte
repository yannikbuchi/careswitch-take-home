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

	<h1 class="mt-8 text-left text-4xl font-bold">Current Users</h1>

	<div class="mt-4 overflow-hidden rounded-lg border border-gray-300">
		<Table.Root>
			<Table.Header class="bg-gray-100">
				<Table.Row>
					<Table.Head class="w-[100px] p-4">ID</Table.Head>
					<Table.Head class="p-4">Name</Table.Head>
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
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
</div>
