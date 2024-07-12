import { z } from 'zod';

export const addWorkspaceFormSchema = z.object({
	name: z.string().min(1, 'Name is required.'),
	description: z.string().min(1, 'Descriptjoin is required.')
});

export type AddWorkspaceFormSchema = typeof addWorkspaceFormSchema;
