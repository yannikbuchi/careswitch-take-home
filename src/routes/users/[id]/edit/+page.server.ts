import { prisma } from '$lib/server/db';
import type { Actions } from '@sveltejs/kit';
import { fail, redirect } from '@sveltejs/kit';
import { goto } from '$app/navigation';

export const actions: Actions = {
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
