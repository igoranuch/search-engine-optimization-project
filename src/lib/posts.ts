import fs from "fs";
import path from "path";
import matter from "gray-matter";
export { getPostPath } from "./urls";

export type Category = "builds" | "components" | "news" | "reviews";
export type ComponentSubcategory = "cpu" | "gpu" | "ram" | "ssd" | "hdd" | "motherboards";

export const CATEGORIES: Category[] = ["builds", "components", "news", "reviews"];
export const COMPONENT_SUBCATEGORIES: ComponentSubcategory[] = [
  "cpu", "gpu", "ram", "ssd", "hdd", "motherboards",
];
// ssd/hdd live under /components/storage/[type]/, not /components/[subcategory]/
export const STORAGE_TYPES: ComponentSubcategory[] = ["ssd", "hdd"];
export const FLAT_SUBCATEGORIES = COMPONENT_SUBCATEGORIES.filter(
  (s) => !STORAGE_TYPES.includes(s)
);

export type PostFrontmatter = {
  title: string;
  description: string;
  date: string;
  author: string;
  tags: string[];
  category: Category;
  subcategory?: ComponentSubcategory;
  image?: string;
  /*
   * SEO-ПОЯСНЕННЯ: Review schema fields
   *
   * Що: rating (0-10) та reviewedProduct дозволяють Google відображати
   *   зірки/рейтинг у сніпеті результатів пошуку через Review schema.
   * Навіщо: Сніпети з зірочками мають CTR на 15-30% вищий ніж звичайні.
   * Як впливає: Додаємо до фронтматеру статей-оглядів — Google підбирає
   *   їх автоматично і може показати ratingValue прямо в пошуку.
   */
  rating?: number;
  reviewedProduct?: string;
};

export type PostMeta = PostFrontmatter & {
  slug: string;
  readingTime: number;
};

export type Post = PostMeta & {
  content: string;
};

const CONTENT_DIR = path.join(process.cwd(), "content");

/*
 * SEO-ПОЯСНЕННЯ: Час читання (Reading Time)
 *
 * Що: Розрахунок приблизного часу читання статті на основі кількості слів.
 * Навіщо: Час читання — сигнал якості контенту. Статті з позначкою "8 хв читання"
 *   мають вищий CTR ніж без неї, бо користувач одразу розуміє обсяг матеріалу.
 *   Менший bounce rate та більший dwell time = позитивні поведінкові сигнали для Google.
 * Як впливає: Покращує UX та побічно впливає на SEO через поведінкові метрики.
 * Середня швидкість читання: ~200 слів/хв для технічного контенту.
 */
function calculateReadingTime(htmlContent: string): number {
  const text = htmlContent.replace(/<[^>]+>/g, " ").trim();
  const words = text.split(/\s+/).filter((w) => w.length > 0).length;
  return Math.max(1, Math.round(words / 200));
}

function readAllPosts(locale: string): PostMeta[] {
  const dir = path.join(CONTENT_DIR, locale);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".html"))
    .map((filename) => {
      const slug = filename.replace(/\.html$/, "");
      const fileContent = fs.readFileSync(path.join(dir, filename), "utf-8");
      const { data, content } = matter(fileContent);
      const readingTime = calculateReadingTime(content);
      return { slug, readingTime, ...(data as PostFrontmatter) };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}


export function getAllPosts(locale: string): PostMeta[] {
  return readAllPosts(locale);
}

export function getPostsByCategory(locale: string, category: Category): PostMeta[] {
  return readAllPosts(locale).filter((p) => p.category === category);
}

export function getPostsBySubcategory(
  locale: string,
  subcategory: ComponentSubcategory
): PostMeta[] {
  return readAllPosts(locale).filter(
    (p) => p.category === "components" && p.subcategory === subcategory
  );
}

export function getPostBySlug(locale: string, slug: string): Post | null {
  const filePath = path.join(CONTENT_DIR, locale, `${slug}.html`);
  if (!fs.existsSync(filePath)) return null;

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);
  const readingTime = calculateReadingTime(content);

  return { slug, content, readingTime, ...(data as PostFrontmatter) };
}

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

export function getAllPostSlugs(locale: string): string[] {
  const dir = path.join(CONTENT_DIR, locale);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".html"))
    .map((f) => f.replace(/\.html$/, ""));
}

/** For generateStaticParams — non-component articles: {locale, category, slug} */
export function getPostsForStaticParams(
  locale: string
): { slug: string; category: string }[] {
  return readAllPosts(locale)
    .filter((p) => p.category !== "components")
    .map((p) => ({ slug: p.slug, category: p.category }));
}

/** For generateStaticParams — flat component articles (cpu/gpu/ram/motherboards): {subcategory, slug} */
export function getComponentPostsForStaticParams(
  locale: string
): { slug: string; subcategory: string }[] {
  return readAllPosts(locale)
    .filter((p) => p.category === "components" && p.subcategory && !STORAGE_TYPES.includes(p.subcategory as ComponentSubcategory))
    .map((p) => ({ slug: p.slug, subcategory: p.subcategory! }));
}

/** For generateStaticParams — storage articles (ssd/hdd): {storageType, slug} */
export function getStoragePostsForStaticParams(
  locale: string
): { slug: string; storageType: string }[] {
  return readAllPosts(locale)
    .filter((p) => p.category === "components" && STORAGE_TYPES.includes(p.subcategory as ComponentSubcategory))
    .map((p) => ({ slug: p.slug, storageType: p.subcategory! }));
}
