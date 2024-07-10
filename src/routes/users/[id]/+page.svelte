<script>
	let { data } = $props();
	let user = data.user;
	let full_name = user?.first_name + ' ' + user?.last_name;
</script>

<h1>{full_name}</h1>
