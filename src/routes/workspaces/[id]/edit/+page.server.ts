import { prisma } from '$lib/server/db';
import type { Actions } from '@sveltejs/kit';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate, message } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

const workspaceSchema = z.object({
	name: z.string().min(1, 'First name is required'),
	description: z.string().min(1, 'Last name is required')
});

export const load = async ({ params }) => {
	const updateWorkspaceForm = await superValidate(zod(workspaceSchema));

	return { updateWorkspaceForm };
};

export const actions: Actions = {
	editWorkspace: async ({ request, params }) => {
		const form = await superValidate(request, zod(workspaceSchema));
		let updateSuccessful = false;

		if (!form.valid) {
			return message(form, 'Invalid form', { status: 400 });
		}

		try {
			const { name, description } = form.data;
			await prisma.workspace.update({
				where: { id: params.id },
				data: { name, description }
			});
			updateSuccessful = true;
		} catch (error) {
			return fail(500, { error: 'Failed to update workspace.' });
		}

		redirect(303, `/workspaces/${params.id}`);
	},
	deleteWorkspace: async ({ params }) => {
		let deleteSuccess = false;

		try {
			await prisma.workspace.delete({
				where: {
					id: params.id
				}
			});
			deleteSuccess = true;
		} catch (error) {
			return fail(500, { error: 'Failed to delete workspace' });
		}

		if (deleteSuccess) {
			return redirect(303, '/workspaces');
		}
	}
};
