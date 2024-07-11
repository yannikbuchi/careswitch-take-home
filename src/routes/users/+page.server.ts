import { prisma } from '$lib/server/db';
import { redirect, fail, type Actions } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { addUserFormSchema } from './schema';

export const load = async () => {
	const users = await prisma.user.findMany();

	return { users, form: await superValidate(zod(addUserFormSchema)) };
};

export const actions: Actions = {
	addUser: async (event) => {
		const form = await superValidate(event, zod(addUserFormSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		try {
			const { first_name, last_name } = form.data;
			const newUser = await prisma.user.create({
				data: { first_name, last_name }
			});
			return {
				form,
				newUser
			};
		} catch (error) {
			return { status: 500, body: { error: 'Failed to create user.' } };
		}
	}
};
