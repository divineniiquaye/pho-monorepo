import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
    loader: glob({ pattern: "**/*.{md,mdx}", base: "content/blog" }),
    schema: z.object({
        title: z.string(),
        description: z.string(),
        pubDate: z.coerce.date(),
        featured: z.boolean().optional(),
        author: z.string(),
        image: z.string().optional(),
        tags: z.array(z.string()).default([]),
        canonicalURL: z.string().optional(),
    }),
});

const docs = defineCollection({
    loader: glob({ pattern: "**/*.{md,mdx}", base: "content/docs" }),
    schema: z.object({
        title: z.string(),
        summary: z.string(),
        lastUpdated: z.date().optional(),
    }),
});

export const collections = { blog, docs };
