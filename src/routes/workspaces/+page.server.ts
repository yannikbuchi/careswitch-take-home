import { prisma } from '$lib/server/db';
import type { Actions } from '@sveltejs/kit';
import { superValidate, message } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

const workspaceSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	description: z.string().min(1, 'Description is required')
});

export const load = async () => {
	const workspaces = await prisma.workspace.findMany();
	const workspaceForm = await superValidate(zod(workspaceSchema));

	return { workspaces, workspaceForm };
};

export const actions: Actions = {
	addWorkspace: async ({ request }) => {
		debugger;
		const form = await superValidate(request, zod(workspaceSchema));
		if (!form.valid) {
			console.log(message(form, 'Invalid form'));
			return message(form, 'Invalid form');
		}
		try {
			const { name, description } = form.data;
			const newWorkspace = await prisma.workspace.create({
				data: { name, description }
			});
			console.log(
				message(form, { text: 'Workspace was successfully added!', id: newWorkspace.id })
			);
			return message(form, { text: 'Workspace was successfully added!', id: newWorkspace.id });
		} catch (error) {
			return { status: 500, body: { error: 'Failed to create workspace.' } };
		}
	}
};
