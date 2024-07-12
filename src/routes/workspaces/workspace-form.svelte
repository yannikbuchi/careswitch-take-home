<script lang="ts">
	import { type Infer, type SuperValidated, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import * as Form from '$lib/components/ui/form';
	import Input from '$lib/components/ui/input/input.svelte';
	import { addWorkspaceFormSchema, type AddWorkspaceFormSchema } from './schema.js';

	export let data: SuperValidated<Infer<AddWorkspaceFormSchema>>;

	const form = superForm(data, {
		validators: zodClient(addWorkspaceFormSchema)
	});

	const { form: formData, enhance } = form;
</script>

<form method="POST" action="?/addWorkspace" use:enhance>
	<Form.Field {form} name="name">
		<Form.Control let:attrs>
			<Form.Label>Name</Form.Label>
			<Input {...attrs} bind:value={$formData.name} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="description">
		<Form.Control let:attrs>
			<Form.Label>Description</Form.Label>
			<Input {...attrs} bind:value={$formData.description} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Button class="mt-4">Submit</Form.Button>
</form>
