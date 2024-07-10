<script>
	import * as Table from '$lib/components/ui/table';
	import Button from '$lib/components/ui/button/button.svelte';
	let { data } = $props();
	let workspace = $state(data.workspace);
	let users = $state(data.users ?? []);
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
				<Table.Cell><a href="/users/{user.user.id}/edit">Edit</a></Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
