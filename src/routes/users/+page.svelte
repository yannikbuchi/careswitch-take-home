<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Button from '$lib/components/ui/button';
	import UsersForm from './users-form.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';

	let { data } = $props();
	let open = $state(false);
</script>

<div class="container mx-auto px-4 py-8">
	<Breadcrumb.Root class="mb-3 p-2">
		<Breadcrumb.BreadcrumbList>
			<Breadcrumb.BreadcrumbItem>
				<Breadcrumb.BreadcrumbLink href="/users">Users</Breadcrumb.BreadcrumbLink>
			</Breadcrumb.BreadcrumbItem>
		</Breadcrumb.BreadcrumbList>
	</Breadcrumb.Root>
	<div class="mb-5 flex w-full items-center justify-between">
		<div class="flex space-x-2">
			<img src="/users.svg" alt="Users Icon" class="mt-2 h-7 w-7" />
			<h1 class="text-left text-4xl font-bold">Users</h1>
		</div>
		<div>
			<Dialog.Root bind:open>
				<Dialog.Trigger>
					<Button.Root variant="outline" class="mt-4 items-center">+ Add User</Button.Root>
				</Dialog.Trigger>
				<Dialog.Overlay />
				<Dialog.Content>
					<Dialog.Title>Add New User</Dialog.Title>
					<UsersForm data={data.form} />
				</Dialog.Content>
			</Dialog.Root>
		</div>
	</div>
	<hr class="my-4" />

	<div class="mt-4 overflow-hidden rounded-lg border border-gray-300">
		<Table.Root>
			<Table.Header class="bg-gray-100">
				<Table.Row>
					<Table.Head class="w-[200px] p-4"></Table.Head>
					<Table.Head class="w-[200px] p-4">Name</Table.Head>
					<Table.Head class="w-[300px] p-4">ID</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#if data.users.length === 0}
					<tr>
						<td colspan="4" class="p-4 text-center text-gray-500">There are currently no users.</td>
					</tr>
				{:else}
					{#each data.users as user (user.id)}
						<Table.Row>
							<Table.Cell class="d flex w-[200px] p-4 text-right">
								<Button.Root variant="link" href="/users/{user.id}">
									<img src="/open.svg" alt="open user" class="mt-2 h-5 w-5" />
								</Button.Root>
							</Table.Cell>
							<Table.Cell class="w-[200px] p-4">
								{user.first_name + ' ' + user.last_name}
							</Table.Cell>

							<Table.Cell class="w-[300px] p-4 font-medium"
								><Badge class="bg-blue-400">{user.id}</Badge></Table.Cell
							>
						</Table.Row>
					{/each}
				{/if}
			</Table.Body>
		</Table.Root>
	</div>
</div>
