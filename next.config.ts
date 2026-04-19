import type { NextConfig } from "next";

// Редиректи зі старих URL /blog/[slug] на нові /blog/[category]/[slug]
// Потрібні щоб Google не отримав 404 на вже проіндексованих сторінках
const SLUG_TO_CATEGORY: Record<string, string> = {
  "rtx-4070-review": "components",
  "rtx-4080-super-review": "components",
  "ryzen-7800x3d-vs-i7-14700k": "components",
  "ddr5-ram-comparison-2026": "components",
  "best-ssd-2026": "components",
  "budget-gaming-pc-build-2026": "builds",
  "pc-of-the-month-february-2026": "builds",
};

const nextConfig: NextConfig = {
  async redirects() {
    const locales = ["uk", "en"];
    return Object.entries(SLUG_TO_CATEGORY).flatMap(([slug, category]) =>
      locales.map((locale) => ({
        source: `/${locale}/blog/${slug}`,
        destination: `/${locale}/blog/${category}/${slug}`,
        permanent: true,
      }))
    );
  },
};

export default nextConfig;
