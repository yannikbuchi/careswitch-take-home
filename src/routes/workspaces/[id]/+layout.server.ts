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

	const usersInWorkspaceOnWorkspaces = await prisma.usersOnWorkspaces.findMany({
		where: {
			workspaceId: params.id
		},
		include: {
			user: true
		}
	});

	const usersIdInWorkspace = usersInWorkspaceOnWorkspaces.map((uow) => uow.userId);

	const usersInWorkspace = await prisma.user.findMany({
		where: {
			id: {
				in: usersIdInWorkspace
			}
		}
	});

	const usersNotInWorkspace = await prisma.user.findMany({
		where: {
			id: {
				notIn: usersIdInWorkspace
			}
		}
	});

	return { workspace, usersInWorkspace, usersNotInWorkspace };
};
