import { z, defineCollection } from 'astro:content';

const setupCollection = defineCollection({
	schema: z.object({
		title: z.string().optional(),
		needsEnv: z.array(z.string()).optional(),
	}),
});

export const collections = {
	setup: setupCollection,
};
