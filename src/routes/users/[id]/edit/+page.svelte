<script>
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog';

	let { data } = $props();
	let user = data.user;
	let full_name = user?.first_name + ' ' + user?.last_name;

	let dialogOpen = $state(false);
</script>

<h1>Edit User</h1>
<h1>{full_name}</h1>

<Dialog.Root>
	<Dialog.Trigger>
		<Button on:click={() => (dialogOpen = true)} variant="destructive">Delete User</Button>
	</Dialog.Trigger>
	<Dialog.Overlay />
	<Dialog.Content>
		<Dialog.Title>Confirm Delete User</Dialog.Title>
		<form method="POST" action="?/deleteUser">
			<Dialog.Description
				>Are you sure you want to delete this user? This action will permanently remove the user
				from our servers.</Dialog.Description
			>
			<Dialog.Footer class="sm:justify-start">
				<Dialog.Close asChild>
					<Button type="submit" variant="destructive">Delete</Button>
				</Dialog.Close>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
