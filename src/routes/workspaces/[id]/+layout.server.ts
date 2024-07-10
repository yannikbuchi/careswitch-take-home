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
			error: new Error('Workspace not found')
		};
	}

	return { workspace };
};
