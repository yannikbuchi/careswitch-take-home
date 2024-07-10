import { prisma } from '$lib/server/db';
import { fail, redirect } from '@sveltejs/kit';

export const load = async ({ params }) => {
	const workspaceId = params.id;
};

export const actions = {
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
	}
};
