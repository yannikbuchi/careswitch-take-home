<script>
	import * as Table from '$lib/components/ui/table';
	import Button from '$lib/components/ui/button/button.svelte';

	let { data } = $props();
	let user = data.user;
	let workspaces = $state(data.workspaces ?? []);
	let full_name = user?.first_name + ' ' + user?.last_name;
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="text-left text-4xl font-bold">{full_name}</h1>

	<h1 class="mt-8 text-left text-4xl font-bold">Workspaces</h1>

	<div class="mt-4 overflow-hidden rounded-lg border border-gray-300">
		<Table.Root>
			<Table.Header class="bg-gray-100">
				<Table.Row>
					<Table.Head class="w-[100px] p-4">ID</Table.Head>
					<Table.Head class="p-4">Name</Table.Head>
					<Table.Head class="p-4">Description</Table.Head>
					<Table.Head class="p-4"></Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each workspaces as workspace}
					<Table.Row>
						<Table.Cell class="p-4 font-medium">{workspace.workspace.id}</Table.Cell>
						<Table.Cell class="p-4">
							<Button variant="link" href="/workspaces/{workspace.workspace.id}">
								{workspace.workspace.name}
							</Button>
						</Table.Cell>
						<Table.Cell class="p-4">{workspace.workspace.description}</Table.Cell>
						<Table.Cell class="p-4">
							<Button variant="outline">Leave</Button>
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
</div>
