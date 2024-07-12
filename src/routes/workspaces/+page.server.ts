import { prisma } from '$lib/server/db';
import { fail, type Actions } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { addWorkspaceFormSchema } from './schema';

export const load = async () => {
	const workspaces = await prisma.workspace.findMany({
		orderBy: {
			name: 'asc'
		}
	});

	return { workspaces, form: await superValidate(zod(addWorkspaceFormSchema)) };
};

export const actions: Actions = {
	addWorkspace: async (event) => {
		const form = await superValidate(event, zod(addWorkspaceFormSchema));

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		try {
			const { name, description } = form.data;
			const newWorkspace = await prisma.workspace.create({
				data: { name, description }
			});
			return {
				form,
				newWorkspace
			};
		} catch (error) {
			return { status: 500, body: { error: 'Failed to create user.' } };
		}
	}
};
