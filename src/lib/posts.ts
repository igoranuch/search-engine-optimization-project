import fs from "fs";
import path from "path";
import matter from "gray-matter";

export type Category = "components" | "builds";

export type PostFrontmatter = {
  title: string;
  description: string;
  date: string;
  author: string;
  tags: string[];
  category: Category;
  image?: string;
};

export type PostMeta = PostFrontmatter & {
  slug: string;
};

export type Post = PostMeta & {
  content: string;
};

export const CATEGORIES: Category[] = ["components", "builds"];

const CONTENT_DIR = path.join(process.cwd(), "content");

function readAllPosts(locale: string): PostMeta[] {
  const dir = path.join(CONTENT_DIR, locale);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".html"))
    .map((filename) => {
      const slug = filename.replace(/\.html$/, "");
      const fileContent = fs.readFileSync(path.join(dir, filename), "utf-8");
      const { data } = matter(fileContent);
      return { slug, ...(data as PostFrontmatter) };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Всі пости для мови, відсортовані за датою.
 */
export function getAllPosts(locale: string): PostMeta[] {
  return readAllPosts(locale);
}

/**
 * Пости конкретної категорії.
 */
export function getPostsByCategory(locale: string, category: Category): PostMeta[] {
  return readAllPosts(locale).filter((p) => p.category === category);
}

/**
 * Конкретний пост за slug та мовою.
 */
export function getPostBySlug(locale: string, slug: string): Post | null {
  const filePath = path.join(CONTENT_DIR, locale, `${slug}.html`);
  if (!fs.existsSync(filePath)) return null;

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  return { slug, content, ...(data as PostFrontmatter) };
}

/**
 * Пов'язані пости (за спільними тегами, далі за датою).
 */
export function getRelatedPosts(
  locale: string,
  currentSlug: string,
  maxCount = 3
): PostMeta[] {
  const all = readAllPosts(locale);
  const current = all.find((p) => p.slug === currentSlug);
  const others = all.filter((p) => p.slug !== currentSlug);

  if (!current) return others.slice(0, maxCount);

  const currentTags = new Set(current.tags ?? []);
  const scored = others.map((post) => ({
    post,
    sharedTags: (post.tags ?? []).filter((t) => currentTags.has(t)).length,
  }));
  scored.sort((a, b) => b.sharedTags - a.sharedTags);

  return scored.slice(0, maxCount).map((s) => s.post);
}

/**
 * Всі slug для generateStaticParams (плоский список).
 */
export function getAllPostSlugs(locale: string): string[] {
  const dir = path.join(CONTENT_DIR, locale);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".html"))
    .map((f) => f.replace(/\.html$/, ""));
}

/**
 * Всі пости з категорією для generateStaticParams нового роуту.
 */
export function getAllPostsWithCategory(
  locale: string
): { slug: string; category: Category }[] {
  return readAllPosts(locale).map((p) => ({ slug: p.slug, category: p.category }));
}
