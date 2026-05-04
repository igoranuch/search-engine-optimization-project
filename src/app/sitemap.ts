import type { MetadataRoute } from "next";
import { getAllPosts, CATEGORIES, FLAT_SUBCATEGORIES, STORAGE_TYPES } from "@/lib/posts";
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

    // Component subcategory index pages (cpu, gpu, ram, motherboards)
    // FLAT_SUBCATEGORIES excludes ssd/hdd — those live under /components/storage/[type]/
    for (const sub of FLAT_SUBCATEGORIES) {
      entries.push({
        url: `${SITE_URL}/${locale}/components/${sub}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.85,
      });
    }

    // Storage type index pages (/components/storage/ssd, /components/storage/hdd)
    for (const type of STORAGE_TYPES) {
      entries.push({
        url: `${SITE_URL}/${locale}/components/storage/${type}`,
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
