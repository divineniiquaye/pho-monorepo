import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel/static";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";

import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePresetMinify from "rehype-preset-minify";
import tailwindcss from "@tailwindcss/vite";
import remarkToc from "remark-toc";

export default defineConfig({
    site: "https://pho.biurad.com",
   adapter: vercel(),
    vite: {
        plugins: [tailwindcss()],
    },
    integrations: [
        react(),
        mdx({
            syntaxHighlight: "shiki",
            shikiConfig: { theme: "dark-plus" },
            remarkPlugins: [remarkToc],
            rehypePlugins: [
                rehypePresetMinify,
                [
                    rehypeAutolinkHeadings,
                    {
                        properties: {
                            className: ["anchor"],
                        },
                    },
                ],
            ],
            remarkRehype: { footnoteLabel: "Footnote" },
            gfm: false,
        }),
        sitemap(),
    ],
});
