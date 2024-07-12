import { prisma } from '$lib/server/db';
import type { Actions } from '@sveltejs/kit';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate, message } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

const userSchema = z.object({
	first_name: z.string().min(1, 'First name is required'),
	last_name: z.string().min(1, 'Last name is required')
});

export const load = async ({ params }) => {
	const updateUserForm = await superValidate(zod(userSchema));

	return { updateUserForm };
};

export const actions: Actions = {
	editUser: async ({ request, params }) => {
		const form = await superValidate(request, zod(userSchema));
		let updateSuccessful = false;

		if (!form.valid) {
			return message(form, 'Invalid form', { status: 400 });
		}

		try {
			const { first_name, last_name } = form.data;
			await prisma.user.update({
				where: { id: params.id },
				data: { first_name, last_name }
			});
			updateSuccessful = true;
		} catch (error) {
			return fail(500, { error: 'Failed to update user.' });
		}

		redirect(303, `/users/${params.id}`);
	},
	deleteUser: async ({ params }) => {
		let deleteSuccess = false;

		try {
			await prisma.user.delete({
				where: {
					id: params.id
				}
			});
			deleteSuccess = true;
		} catch (error) {
			return fail(500, { error: 'Failed to delete user' });
		}

		if (deleteSuccess) {
			return redirect(303, '/users');
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
