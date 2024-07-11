import { prisma } from '$lib/server/db';

export const load = async ({ params }) => {
	const workspace = await prisma.workspace.findUnique({
		where: {
			id: params.id
		}
	});

	if (!workspace) {
		return {
			status: 404,
			error: 'Workspace not found'
		};
	}

	const users = await prisma.usersOnWorkspaces.findMany({
		where: {
			workspaceId: params.id
		},
		include: {
			user: true
		}
	});

	const usersInWorkspace = users.map((uow) => uow.userId);

	const usersNotInWorkspace = await prisma.user.findMany({
		where: {
			id: {
				notIn: usersInWorkspace
			}
		}
	});

	return { workspace, users, usersNotInWorkspace };
};
