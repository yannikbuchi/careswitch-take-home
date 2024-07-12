<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Button from '$lib/components/ui/button';
	import WorkspaceForm from './workspace-form.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';

	let { data } = $props();
</script>

<div class="container mx-auto px-4 py-8">
	<div class="mb-5 flex w-full items-center justify-between">
		<div class="flex space-x-2">
			<img src="/workspace.svg" alt="Workspace Icon" class="mt-2 h-7 w-7" />
			<h1 class="text-left text-4xl font-bold">Workspaces</h1>
		</div>
		<div>
			<Dialog.Root>
				<Dialog.Trigger>
					<Button.Root class="mt-4">+ Add Workspace</Button.Root>
				</Dialog.Trigger>
				<Dialog.Overlay />
				<Dialog.Content>
					<Dialog.Title>Add New Workspace</Dialog.Title>
					<WorkspaceForm data={data.form} />
				</Dialog.Content>
			</Dialog.Root>
		</div>
	</div>

	<div class="mt-4 overflow-hidden rounded-lg border border-gray-300">
		<Table.Root>
			<Table.Header class="bg-gray-100">
				<Table.Row>
					<Table.Head class="p-4">Workspace</Table.Head>
					<Table.Head class="p-4">Description</Table.Head>
					<Table.Head class="w-[100px] p-4">ID</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each data.workspaces as workspace (workspace.id)}
					<Table.Row>
						<Table.Cell class="p-4">
							<Button.Root variant="link" href={`/workspaces/${workspace.id}`}>
								{workspace.name}
							</Button.Root>
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
