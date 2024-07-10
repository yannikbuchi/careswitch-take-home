import { prisma } from '$lib/server/db';

export const load = async () => {
	const userCount = await prisma.user.count();
	// TO DO: add workspaceCount
	// const workspaceCount = await prisma.workspace.count();

	return { userCount };
};
