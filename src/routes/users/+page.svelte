<script lang="ts">
	import * as Table from '$lib/components/ui/table';

	let { data } = $props();
</script>

<h1>Users</h1>
<button>+ Add User</button>

<Table.Root>
	<Table.Header>
		<Table.Row>
			<Table.Head class="w-[100px]">ID</Table.Head>
			<Table.Head>Name</Table.Head>
			<Table.Head></Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each data.users as user (user.id)}
			<Table.Row>
				<Table.Cell class="font-medium">{user.id}</Table.Cell>
				<Table.Cell>{user.name}</Table.Cell>
				<Table.Cell>Edit</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
