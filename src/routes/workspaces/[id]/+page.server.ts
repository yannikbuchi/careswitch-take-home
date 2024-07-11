import { prisma } from '$lib/server/db';
import { fail, redirect } from '@sveltejs/kit';

export const load = async ({ params }) => {
	const workspaceId = params.id;
};
