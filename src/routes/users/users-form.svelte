<script lang="ts">
	import { type Infer, type SuperValidated, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import * as Form from '$lib/components/ui/form';
	import Input from '$lib/components/ui/input/input.svelte';
	import { addUserFormSchema, type AddUserFormSchema } from './schema.js';

	export let data: SuperValidated<Infer<AddUserFormSchema>>;

	const form = superForm(data, {
		validators: zodClient(addUserFormSchema)
	});

	const { form: formData, enhance } = form;
</script>

<form method="POST" action="?/addUser" use:enhance>
	<Form.Field {form} name="first_name">
		<Form.Control let:attrs>
			<Form.Label>First Name</Form.Label>
			<Input {...attrs} bind:value={$formData.first_name} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="last_name">
		<Form.Control let:attrs>
			<Form.Label>Last Name</Form.Label>
			<Input {...attrs} bind:value={$formData.last_name} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Button class="mt-4">Submit</Form.Button>
</form>
