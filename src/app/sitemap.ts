import type { MetadataRoute } from "next";
import { getAllPosts, CATEGORIES, COMPONENT_SUBCATEGORIES } from "@/lib/posts";
import type { Category } from "@/lib/posts";
import { SITE_URL } from "@/lib/config";
import { getPostPath } from "@/lib/posts";

const LOCALES = ["uk", "en"] as const;
const FLAT_CATEGORIES = CATEGORIES.filter((c) => c !== "components") as Category[];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  const now = new Date();

  for (const locale of LOCALES) {
    // Homepage
    entries.push({
      url: `${SITE_URL}/${locale}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    });

    // Flat category listing pages (builds, news)
    for (const category of FLAT_CATEGORIES) {
      entries.push({
        url: `${SITE_URL}/${locale}/${category}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.9,
      });
    }

    // Components subcategory pages
    for (const sub of COMPONENT_SUBCATEGORIES) {
      entries.push({
        url: `${SITE_URL}/${locale}/components/${sub}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.85,
      });
    }

    // Individual articles
    const posts = getAllPosts(locale);
    for (const post of posts) {
      entries.push({
        url: `${SITE_URL}${getPostPath(locale, post)}`,
        lastModified: new Date(post.date),
        changeFrequency: "monthly",
        priority: 0.8,
      });
    }
  }

  return entries;
}
