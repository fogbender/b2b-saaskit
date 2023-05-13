import { z, defineCollection } from 'astro:content';

const setupCollection = defineCollection({
	schema: z.object({
		title: z.string(),
		needsEnv: z.array(z.string()),
	}),
});

export const collections = {
	setup: setupCollection,
};
