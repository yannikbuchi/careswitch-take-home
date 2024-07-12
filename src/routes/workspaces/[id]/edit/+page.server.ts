import { prisma } from '$lib/server/db';
import type { Actions } from '@sveltejs/kit';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate, message } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

const workspaceSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	description: z.string().min(1, 'Description is required')
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
	deleteWorkspace: async ({ request, params }) => {
		const data = await request.formData();
		const workspaceId = data.get('worspaceId');
		console.log('Workspace ID!!', workspaceId);
		if (typeof workspaceId !== 'string') {
			return fail(400, { error: 'Invalid workspace Id' });
		}

		try {
			await prisma.usersOnWorkspaces.deleteMany({
				where: {
					workspaceId: workspaceId
				}
			});

			await prisma.workspace.delete({
				where: {
					id: workspaceId
				}
			});
		} catch (error) {
			return fail(500, { error: 'Failed to delete workspace' });
		}
	},
	removeUserFromWorkspace: async ({ request }) => {
		const data = await request.formData();
		const userId = data.get('userId');
		const workspaceId = data.get('workspaceId');
		let removeUserFromWorkspaceSuccess = false;

		if (typeof userId !== 'string' || typeof workspaceId !== 'string') {
			return fail(400, { error: 'Invalid user or workspace ID' });
		}

		try {
			await prisma.usersOnWorkspaces.delete({
				where: {
					userId_workspaceId: {
						userId: userId,
						workspaceId: workspaceId
					}
				}
			});
			removeUserFromWorkspaceSuccess = true;
		} catch (error) {
			return fail(500, { error: 'Failed to remove user from workspace' });
		}

		if (removeUserFromWorkspaceSuccess) {
			return redirect(303, `/workspaces/${workspaceId}`);
		}
	},
	addUserToWorkspace: async ({ request }) => {
		const data = await request.formData();
		const userId = data.get('userId');
		const workspaceId = data.get('workspaceId');
		let addUserToWorkspaceSuccess = false;

		if (typeof userId !== 'string' || typeof workspaceId !== 'string') {
			return fail(400, { error: 'Invalid user or workspace ID' });
		}

		try {
			await prisma.usersOnWorkspaces.create({
				data: {
					userId: userId,
					workspaceId: workspaceId
				}
			});
			addUserToWorkspaceSuccess = true;
		} catch (error) {
			return fail(500, { error: 'Failed to add user to workspace' });
		}

		if (addUserToWorkspaceSuccess) {
			return redirect(303, `/workspaces/${workspaceId}`);
		}
	}
};
