<script>
	import Button from '$lib/components/ui/button/button.svelte';
	let { data } = $props();
	let user = data.user;
	let full_name = user?.first_name + ' ' + user?.last_name;
</script>

<h1>Edit User</h1>
<h1>{full_name}</h1>

<Button variant="destructive">Delete User</Button>
