import type { MetadataRoute } from "next";
import { getAllPostSlugs } from "@/lib/posts";
import { SITE_URL } from "@/lib/config";

/*
 * SEO-ПОЯСНЕННЯ: Sitemap
 *
 * Що: sitemap.xml — файл зі списком усіх URL сайту, доступний за /sitemap.xml.
 * Навіщо: Допомагає Google знайти та проіндексувати всі сторінки сайту,
 *   навіть якщо до них немає внутрішніх посилань. Особливо важливо для
 *   нових сайтів, де Google ще не знає про всі сторінки.
 * Як впливає: Прискорює індексацію нових статей. Без sitemap Google може
 *   виявити сторінки через кілька тижнів, з sitemap — часто за кілька днів.
 *
 * changeFrequency — підказка для Google як часто перевіряти сторінку:
 *   - "daily" для головної і списку блогу (оновлюються часто)
 *   - "monthly" для окремих статей (змінюються рідко)
 *
 * priority — відносна важливість сторінки від 0 до 1:
 *   - 1.0 — головна сторінка (найважливіша)
 *   - 0.9 — сторінка списку блогу
 *   - 0.8 — окремі статті
 */

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

    // Окремі статті
    const slugs = getAllPostSlugs(locale);
    for (const slug of slugs) {
      entries.push({
        url: `${SITE_URL}/${locale}/blog/${slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.8,
      });
    }
  }

  return entries;
}
