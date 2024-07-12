<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Button from '$lib/components/ui/button';
	import UsersForm from './users-form.svelte';
	import { onMount } from 'svelte';

	let { data } = $props();
	let open = $state(false);
</script>

<div class="container mx-auto px-4 py-8">
	<div class="mb-5 flex w-full items-center justify-between">
		<div class="flex space-x-2">
			<img src="/users.svg" alt="Users Icon" class="mt-2 h-7 w-7" />
			<h1 class="text-left text-4xl font-bold">Users</h1>
		</div>
		<div>
			<Dialog.Root bind:open>
				<Dialog.Trigger>
					<Button.Root class="mt-4 items-center">+ Add User</Button.Root>
				</Dialog.Trigger>
				<Dialog.Overlay />
				<Dialog.Content>
					<Dialog.Title>Add New User</Dialog.Title>
					<UsersForm data={data.form} />
				</Dialog.Content>
			</Dialog.Root>
		</div>
	</div>

	<div class="mt-4 overflow-hidden rounded-lg border border-gray-300">
		<Table.Root>
			<Table.Header class="bg-gray-100">
				<Table.Row>
					<Table.Head class="w-[300px] p-4">ID</Table.Head>
					<Table.Head class="w-[200px] p-4">Name</Table.Head>
					<Table.Head class="mr-4 p-4 text-right"></Table.Head>
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
							<Table.Cell class="w-[300px] p-4 font-medium">{user.id}</Table.Cell>
							<Table.Cell class="w-[200px] p-4">
								<Button.Root variant="link" href="/users/{user.id}">
									{user.first_name + ' ' + user.last_name}
								</Button.Root>
							</Table.Cell>
							<Table.Cell class="mr-10 p-4 text-right">
								<a href="/users/{user.id}/edit" class="text-blue-500 hover:underline">Edit</a>
							</Table.Cell>
						</Table.Row>
					{/each}
				{/if}
			</Table.Body>
		</Table.Root>
	</div>
</div>
