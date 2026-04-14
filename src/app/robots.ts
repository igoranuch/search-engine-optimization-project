import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/config";

/*
 * SEO-ПОЯСНЕННЯ: robots.txt
 *
 * Що: robots.txt — файл-інструкція для пошукових роботів, доступний за /robots.txt.
 *   Вказує яким роботам дозволено сканувати сайт і які сторінки заборонені.
 * Навіщо: Дозволяє контролювати, що Google індексує, а що ні.
 *   Також вказує на sitemap.xml — це спрощує виявлення сайту.
 * Як впливає: Заблоковані через Disallow сторінки не з'являться в пошуку.
 *   Для блогу ми дозволяємо всі сторінки (Allow: /).
 *
 * userAgent: "*" — правило поширюється на всіх роботів (Google, Bing тощо).
 * Якщо потрібно заблокувати конкретний бот: userAgent: "GPTBot" (наприклад).
 */

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
