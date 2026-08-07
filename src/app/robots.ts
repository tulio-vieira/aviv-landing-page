import type { MetadataRoute } from "next";
import { SITE_URL } from "@/config/site";
import { environmentConfig } from "@/config/environment";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      ...(environmentConfig.allowIndexing ? { allow: "/" } : { disallow: "/" }),
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
