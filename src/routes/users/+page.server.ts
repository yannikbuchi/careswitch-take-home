import { prisma } from '$lib/server/db';
import { redirect, type Actions } from '@sveltejs/kit';
import { superValidate, message } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

const userSchema = z.object({
	first_name: z.string().min(1, 'First name is required'),
	last_name: z.string().min(1, 'Last name is required')
});

export const load = async () => {
	const users = await prisma.user.findMany();
	const userForm = await superValidate(zod(userSchema));

	return { users, userForm };
};

export const actions: Actions = {
	addUser: async ({ request }) => {
		const form = await superValidate(request, zod(userSchema));
		let addUserSuccess = false;
		if (!form.valid) {
			console.log(message(form, 'Invalid form'));
			// TO DO: add frontend error handling of forms
			return message(form, 'Invalid form');
		}
		try {
			const { first_name, last_name } = form.data;
			const newUser = await prisma.user.create({
				data: { first_name, last_name }
			});
			console.log(message(form, { text: 'User was successfully added!', id: newUser.id }));
			addUserSuccess = true;
		} catch (error) {
			return { status: 500, body: { error: 'Failed to create user.' } };
		}

		if (addUserSuccess) {
			redirect(303, '/users');
		}
	}
};
