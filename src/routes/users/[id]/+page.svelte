<script>
	import * as Table from '$lib/components/ui/table';
	import Button from '$lib/components/ui/button/button.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';

	let { data } = $props();
	let user = data.user;
	let workspaces = $state(data.workspacesInUser ?? []);
	let full_name = user?.first_name + ' ' + user?.last_name;
</script>

<div class="container mx-auto px-4 py-8">
	<Breadcrumb.Root class="mb-3 p-2">
		<Breadcrumb.BreadcrumbList>
			<Breadcrumb.BreadcrumbItem>
				<Breadcrumb.BreadcrumbLink href="/users">Users</Breadcrumb.BreadcrumbLink>
			</Breadcrumb.BreadcrumbItem>
			<Breadcrumb.BreadcrumbSeparator />
			<Breadcrumb.BreadcrumbItem>
				<Breadcrumb.BreadcrumbLink href="/users/{user?.id}' ">{full_name}</Breadcrumb.BreadcrumbLink
				>
			</Breadcrumb.BreadcrumbItem>
		</Breadcrumb.BreadcrumbList>
	</Breadcrumb.Root>
	<div class="flex items-center justify-between">
		<div class="flex space-x-2">
			<img src="/user.svg" alt="Workspace Icon" class="mt-2 h-7 w-7" />
			<h1 class="text-left text-4xl font-bold">{full_name}</h1>
		</div>
		<div>
			<Button href="/users/{user?.id}/edit" class="ml-4 mt-2">Manage User</Button>
		</div>
	</div>
	<h2 class="mt-8 text-left text-3xl font-bold">Current Workspaces</h2>

	<div class="mt-4 overflow-hidden rounded-lg border border-gray-300">
		<Table.Root>
			<Table.Header class="bg-gray-100">
				<Table.Row>
					<Table.Head class="p-4">Name</Table.Head>
					<Table.Head class="p-4">Description</Table.Head>
					<Table.Head class="w-[100px] p-4">ID</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each workspaces as workspace}
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
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
</div>
