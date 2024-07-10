import { prisma } from '$lib/server/db';
import type { Actions } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

const userSchema = z.object({
	first_name: z.string().min(1, 'First name is required'),
	last_name: z.string().min(1, 'Last name is required')
});

export const load = async () => {
	const users = await prisma.user.findMany();
	const form = await superValidate(zod(userSchema));

	return { users, form };
};

export const actions: Actions = {
	addUser: async ({ request }) => {
		const form = await superValidate(request, zod(userSchema));

		if (!form.valid) {
			return { status: 400, body: { form } };
		}

		try {
			const { first_name, last_name } = form.data;
			const newUser = await prisma.user.create({
				data: { first_name, last_name }
			});
			return { status: 201, body: { newUser, form } };
		} catch (error) {
			return { status: 500, body: { error: 'Failed to create user.' } };
		}
	}
};
