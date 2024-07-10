import { prisma } from '$lib/server/db';

export const load = async ({ params }) => {
	const user = await prisma.user.findUnique({
		where: {
			id: params.id
		}
	});

	if (!user) {
		return {
			status: 404,
			error: new Error('User not found')
		};
	}

	return { user };
};
