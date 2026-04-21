import type { PostMeta } from "./posts";

/**
 * Returns the canonical URL path for a post.
 * Safe to import in client components — no Node.js dependencies.
 */
const STORAGE_TYPES = ["ssd", "hdd"] as const;

export function getPostPath(locale: string, post: Pick<PostMeta, "category" | "subcategory" | "slug">): string {
  if (post.category === "components" && post.subcategory) {
    if ((STORAGE_TYPES as readonly string[]).includes(post.subcategory)) {
      return `/${locale}/components/storage/${post.subcategory}/${post.slug}`;
    }
    return `/${locale}/components/${post.subcategory}/${post.slug}`;
  }
  return `/${locale}/${post.category}/${post.slug}`;
}
