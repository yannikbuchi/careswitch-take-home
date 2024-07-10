<script lang="ts">
	import * as Table from '$lib/components/ui/table';

	let { data } = $props();
</script>

<h1>Workspaces</h1>

<button>+ Add Workspace</button>

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
		{#each data.workspaces as workspace (workspace.id)}
			<Table.Row>
				<Table.Cell class="font-medium">{workspace.id}</Table.Cell>
				<Table.Cell>{workspace.name}</Table.Cell>
				<Table.Cell><a href="/workspaces/{workspace.id}/edit">Edit</a></Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
