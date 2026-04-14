/**
 * URL задеплоєного сайту.
 * Використовується в sitemap.xml, robots.txt та JSON-LD structured data.
 *
 * Для локальної розробки можна перевизначити через змінну середовища:
 *   NEXT_PUBLIC_BASE_URL=http://localhost:3000
 */
export const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export const SITE_URL =
  "https://search-engine-optimization-project-two.vercel.app";
