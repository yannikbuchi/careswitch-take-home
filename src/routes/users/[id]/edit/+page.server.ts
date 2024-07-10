import { prisma } from '$lib/server/db';
import type { Actions } from '@sveltejs/kit';
import { fail, redirect } from '@sveltejs/kit';

export const actions: Actions = {
	deleteUser: async ({ params }) => {
		try {
			await prisma.user.delete({
				where: {
					id: params.id
				}
			});
			return redirect(303, '/users');
		} catch (error) {
			return fail(500, { error: 'Failed to delete user' });
		}
	}
};
