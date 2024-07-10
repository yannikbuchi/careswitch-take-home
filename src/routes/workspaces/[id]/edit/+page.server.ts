import { prisma } from '$lib/server/db';
import type { Actions } from '@sveltejs/kit';
import { fail, redirect } from '@sveltejs/kit';

export const actions: Actions = {
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
