import type { NextConfig } from "next";

// Old URL → new URL mapping for permanent redirects.
// Keeps Google from hitting 404s on already-indexed pages.
// flat component subcategories: /blog/components/[slug] → /components/[sub]/[slug]
const SLUG_TO_SUBCATEGORY: Record<string, string> = {
  "rtx-4070-review": "gpu",
  "rtx-4080-super-review": "gpu",
  "ryzen-7800x3d-vs-i7-14700k": "cpu",
  "ddr5-ram-comparison-2026": "ram",
};

// storage articles: /blog/components/[slug] → /components/storage/[type]/[slug]
const SLUG_TO_STORAGE: Record<string, string> = {
  "best-ssd-2026": "ssd",
};

const SLUG_TO_FLAT_CATEGORY: Record<string, string> = {
  "budget-gaming-pc-build-2026": "builds",
  "pc-of-the-month-february-2026": "builds",
  "pc-industry-2026-ai-market": "news",
};

const nextConfig: NextConfig = {
  async redirects() {
    const locales = ["uk", "en"];

    // /[locale]/blog → /[locale]
    const blogRoot = locales.map((locale) => ({
      source: `/${locale}/blog`,
      destination: `/${locale}`,
      permanent: false,
    }));

    // /[locale]/blog/components/[slug] → /[locale]/components/[subcategory]/[slug]
    const componentRedirects = Object.entries(SLUG_TO_SUBCATEGORY).flatMap(
      ([slug, subcategory]) =>
        locales.map((locale) => ({
          source: `/${locale}/blog/components/${slug}`,
          destination: `/${locale}/components/${subcategory}/${slug}`,
          permanent: true,
        }))
    );

    // /[locale]/blog/[category]/[slug] → /[locale]/[category]/[slug]
    const flatRedirects = Object.entries(SLUG_TO_FLAT_CATEGORY).flatMap(
      ([slug, category]) =>
        locales.map((locale) => ({
          source: `/${locale}/blog/${category}/${slug}`,
          destination: `/${locale}/${category}/${slug}`,
          permanent: true,
        }))
    );

    // /[locale]/components → /[locale] (no index page exists)
    const componentsRoot = locales.map((locale) => ({
      source: `/${locale}/components`,
      destination: `/${locale}`,
      permanent: false,
    }));

    // /[locale]/blog/components/[slug] → /[locale]/components/storage/[type]/[slug]
    const storageRedirects = Object.entries(SLUG_TO_STORAGE).flatMap(
      ([slug, type]) =>
        locales.map((locale) => ({
          source: `/${locale}/blog/components/${slug}`,
          destination: `/${locale}/components/storage/${type}/${slug}`,
          permanent: true,
        }))
    );

    return [...blogRoot, ...componentsRoot, ...componentRedirects, ...storageRedirects, ...flatRedirects];
  },
};

export default nextConfig;
