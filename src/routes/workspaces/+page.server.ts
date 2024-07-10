import { prisma } from '$lib/server/db';

export const load = async () => {
	const workspaces = await prisma.workspace.findMany();

	return { workspaces };
};
