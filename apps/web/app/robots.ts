import type { MetadataRoute } from "next";
import { Env } from "@/env";

const protocol = Env.NEXT_URL?.startsWith("https") ? "https" : "http";
const url = new URL(`${protocol}://${Env.NEXT_URL}`);

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
        },
        sitemap: new URL("/sitemap.xml", url.href).href,
    };
}
