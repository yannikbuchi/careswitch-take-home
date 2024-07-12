<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import Button from '$lib/components/ui/button/button.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';

	let { data } = $props();
	let workspace = $state(data.workspace);
	let usersInWorkspace = $state(data.usersInWorkspace ?? []);
</script>

<div class="container mx-auto px-4 py-8">
	<Breadcrumb.Root class="mb-3 p-2">
		<Breadcrumb.BreadcrumbList>
			<Breadcrumb.BreadcrumbItem>
				<Breadcrumb.BreadcrumbLink href="/workspaces">Workspaces</Breadcrumb.BreadcrumbLink>
			</Breadcrumb.BreadcrumbItem>
			<Breadcrumb.BreadcrumbSeparator />
			<Breadcrumb.BreadcrumbItem>
				<Breadcrumb.BreadcrumbLink href="/workspaces/{workspace?.id}' "
					>{workspace?.name}</Breadcrumb.BreadcrumbLink
				>
			</Breadcrumb.BreadcrumbItem>
		</Breadcrumb.BreadcrumbList>
	</Breadcrumb.Root>
	<div class="flex items-center justify-between">
		<div class="flex items-center space-x-2">
			<img src="/workspace.svg" alt="Workspace Icon" class="mt-2 h-7 w-7" />
			<h1 class="text-left text-4xl font-bold">{workspace?.name}</h1>
		</div>
		<div>
			<Button href="/workspaces/{workspace?.id}/edit" class="mt-4">Manage Workspace</Button>
		</div>
	</div>
	<p class="mt-4 text-left text-lg">{workspace?.description}</p>

	<h3 class="mt-8 text-left text-3xl font-bold">Current Users</h3>

	<div class="mt-4 overflow-hidden rounded-lg border border-gray-300">
		<Table.Root>
			<Table.Header class="bg-gray-100">
				<Table.Row>
					<Table.Head class="p-4">Name</Table.Head>
					<Table.Head class="w-[100px] p-4">ID</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#if usersInWorkspace.length === 0}
					<Table.Row>
						<Table.Cell class="p-4 text-center text-gray-500"
							>There are currently no users in this workspace.</Table.Cell
						>
					</Table.Row>
				{:else}
					{#each usersInWorkspace as user}
						<Table.Row>
							<Table.Cell class="p-4">
								<Button variant="link" href="/users/{user.id}">
									{user.first_name + ' ' + user.last_name}
								</Button>
							</Table.Cell>
							<Table.Cell class="p-4 font-medium"
								><Badge class="bg-blue-400">{user.id}</Badge></Table.Cell
							>
						</Table.Row>
					{/each}
				{/if}
			</Table.Body>
		</Table.Root>
	</div>
</div>
