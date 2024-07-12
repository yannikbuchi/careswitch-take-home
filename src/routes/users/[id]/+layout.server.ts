import { prisma } from '$lib/server/db';

export const load = async ({ params }) => {
	const user = await prisma.user.findUnique({
		where: {
			id: params.id
		}
	});

	const workspaces = await prisma.usersOnWorkspaces.findMany({
		where: {
			userId: params.id
		},
		include: {
			workspace: true
		}
	});

	const workspacesInUser = workspaces.map((uow) => uow.workspaceId);

	const workspacesNotInUser = await prisma.workspace.findMany({
		where: {
			id: {
				notIn: workspacesInUser
			}
		}
	});

	if (!user) {
		return {
			status: 404,
			error: 'User not found.'
		};
	}

	return { user, workspaces, workspacesNotInUser };
};
