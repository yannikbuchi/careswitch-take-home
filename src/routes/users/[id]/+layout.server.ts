import { prisma } from '$lib/server/db';

export const load = async ({ params }) => {
	const user = await prisma.user.findUnique({
		where: {
			id: params.id
		}
	});

	const usersOnWorkspaces = await prisma.usersOnWorkspaces.findMany({
		where: {
			userId: params.id
		},
		include: {
			workspace: true
		}
	});

	const workspacesIdInUser = usersOnWorkspaces.map((uow) => uow.workspaceId);

	const workspacesInUser = await prisma.workspace.findMany({
		where: {
			id: {
				in: workspacesIdInUser
			}
		},
		orderBy: {
			name: 'asc'
		}
	});

	const workspacesNotInUser = await prisma.workspace.findMany({
		where: {
			id: {
				notIn: workspacesIdInUser
			}
		},
		orderBy: {
			name: 'asc'
		}
	});

	if (!user) {
		return {
			status: 404,
			error: 'User not found.'
		};
	}

	return { user, workspacesInUser, workspacesNotInUser };
};
