import fs from "fs";
import path from "path";
import matter from "gray-matter";

export type PostFrontmatter = {
  title: string;
  description: string;
  date: string;
  author: string;
  tags: string[];
  image?: string;
};

export type PostMeta = PostFrontmatter & {
  slug: string;
};

export type Post = PostMeta & {
  content: string;
};

const CONTENT_DIR = path.join(process.cwd(), "content");

/**
 * Отримати всі пости для конкретної мови, відсортовані за датою (новіші першими).
 */
export function getAllPosts(locale: string): PostMeta[] {
  const dir = path.join(CONTENT_DIR, locale);

  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".html"));

  return files
    .map((filename) => {
      const slug = filename.replace(/\.html$/, "");
      const filePath = path.join(dir, filename);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data } = matter(fileContent);

      return {
        slug,
        ...(data as PostFrontmatter),
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Отримати конкретний пост за slug та мовою.
 */
export function getPostBySlug(locale: string, slug: string): Post | null {
  const filePath = path.join(CONTENT_DIR, locale, `${slug}.html`);

  if (!fs.existsSync(filePath)) return null;

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  return {
    slug,
    content,
    ...(data as PostFrontmatter),
  };
}

/**
 * Отримати пов'язані пости для конкретного поста.
 * Алгоритм: 1) спільні теги (чим більше — тим вище), 2) решта за датою.
 * Повертає до maxCount постів, поточний пост виключається.
 */
export function getRelatedPosts(
  locale: string,
  currentSlug: string,
  maxCount = 3
): PostMeta[] {
  const all = getAllPosts(locale);
  const current = all.find((p) => p.slug === currentSlug);
  const others = all.filter((p) => p.slug !== currentSlug);

  if (!current) return others.slice(0, maxCount);

  const currentTags = new Set(current.tags ?? []);

  const scored = others.map((post) => {
    const sharedTags = (post.tags ?? []).filter((t) => currentTags.has(t)).length;
    return { post, sharedTags };
  });

  scored.sort((a, b) => b.sharedTags - a.sharedTags);

  return scored.slice(0, maxCount).map((s) => s.post);
}

/**
 * Отримати всі slug для генерації статичних шляхів.
 */
export function getAllPostSlugs(locale: string): string[] {
  const dir = path.join(CONTENT_DIR, locale);

  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".html"))
    .map((f) => f.replace(/\.html$/, ""));
}
