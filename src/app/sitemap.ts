import type { MetadataRoute } from "next";
import { getAllPosts, CATEGORIES } from "@/lib/posts";
import { SITE_URL } from "@/lib/config";

const LOCALES = ["uk", "en"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  const now = new Date();

  for (const locale of LOCALES) {
    // Головна сторінка
    entries.push({
      url: `${SITE_URL}/${locale}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    });

    // Список блогу
    entries.push({
      url: `${SITE_URL}/${locale}/blog`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    });

    // Категорійні сторінки
    for (const category of CATEGORIES) {
      entries.push({
        url: `${SITE_URL}/${locale}/blog/${category}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.85,
      });
    }

    // Окремі статті
    const posts = getAllPosts(locale);
    for (const post of posts) {
      entries.push({
        url: `${SITE_URL}/${locale}/blog/${post.category}/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: "monthly",
        priority: 0.8,
      });
    }
  }

  return entries;
}
