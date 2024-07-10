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

		if (!form.valid) {
			return message(form, 'Invalid form', { status: 400 });
		}

		try {
			const { first_name, last_name } = form.data;
			await prisma.user.update({
				where: { id: params.id },
				data: { first_name, last_name }
			});
			return message(form, 'User update successfully!');
		} catch (error) {
			return fail(500, { error: 'Failed to update user.' });
		}
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
	}
};
