<script>
	import * as Table from '$lib/components/ui/table';
	import Button from '$lib/components/ui/button/button.svelte';

	let { data } = $props();
	let user = data.user;
	let workspaces = $state(data.workspaces ?? []);
	let full_name = user?.first_name + ' ' + user?.last_name;
</script>

<h1>{full_name}</h1>

<!-- TO DO: Display Workspaces the user belongs to -->
<h1>Workspaces</h1>

<Table.Root>
	<Table.Header>
		<Table.Row>
			<Table.Head class="w-[100px]">ID</Table.Head>
			<Table.Head>Name</Table.Head>
			<Table.Head>Description</Table.Head>
			<Table.Head></Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each workspaces as workspace}
			<Table.Row>
				<Table.Cell class="font-medium">{workspace.workspace.id}</Table.Cell>
				<Table.Cell
					><Button variant="link" href="/workspaces/{workspace.workspace.id}"
						>{workspace.workspace.name}</Button
					></Table.Cell
				>
				<Table.Cell>{workspace.workspace.description}</Table.Cell>
				<Table.Cell><a href="/workspaces/{workspace.workspace.id}/edit">Edit</a></Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
