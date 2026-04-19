import { notFound } from "next/navigation";
import { getPostBySlug, getAllPostsWithCategory, CATEGORIES } from "@/lib/posts";
import { generatePageMetadata } from "@/lib/seo";
import { getTranslation } from "@/i18n/config";
import ArticleJsonLd, {
  BreadcrumbJsonLd,
  FAQJsonLd,
  extractFAQItems,
} from "@/components/seo/JsonLd";
import RelatedPosts from "@/components/RelatedPosts";
import type { Metadata } from "next";
import { BASE_URL } from "@/lib/config";

type Props = {
  params: Promise<{ locale: string; category: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, category, slug } = await params;
  const post = getPostBySlug(locale, slug);

  if (!post) return {};

  return generatePageMetadata({
    title: `${post.title} — GearForge`,
    description: post.description,
    locale,
    path: `/blog/${category}/${slug}`,
    image: post.image,
  });
}

/*
 * SEO-ПОЯСНЕННЯ: generateStaticParams
 *
 * Що: Ця функція вказує Next.js які сторінки згенерувати статично при збірці.
 * Навіщо: Статично згенеровані сторінки (SSG) завантажуються миттєво,
 *   бо HTML вже готовий — сервер не витрачає час на рендеринг.
 * Як впливає: Google враховує швидкість завантаження (Core Web Vitals)
 *   як фактор ранжування. SSG-сторінки отримують найкращі показники.
 */
export async function generateStaticParams() {
  const locales = ["uk", "en"];
  const params: { locale: string; category: string; slug: string }[] = [];

  for (const locale of locales) {
    const posts = getAllPostsWithCategory(locale);
    for (const { slug, category } of posts) {
      params.push({ locale, category, slug });
    }
  }

  return params;
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, category, slug } = await params;

  // Validate category
  if (!CATEGORIES.includes(category as never)) notFound();

  const post = getPostBySlug(locale, slug);
  const { t } = await getTranslation(locale);

  if (!post || post.category !== category) notFound();

  const articleUrl = `${BASE_URL}/${locale}/blog/${category}/${slug}`;
  const categoryUrl = `${BASE_URL}/${locale}/blog/${category}`;
  const faqItems = extractFAQItems(post.content);

  const categoryLabel =
    category === "components"
      ? locale === "uk" ? "Компоненти" : "Components"
      : locale === "uk" ? "Збірки" : "Builds";

  return (
    <>
      <ArticleJsonLd
        title={post.title}
        description={post.description}
        date={post.date}
        author={post.author}
        url={articleUrl}
        image={post.image}
      />

      <BreadcrumbJsonLd
        items={[
          { name: locale === "uk" ? "Головна" : "Home", url: `${BASE_URL}/${locale}` },
          { name: locale === "uk" ? "Блог" : "Blog", url: `${BASE_URL}/${locale}/blog` },
          { name: categoryLabel, url: categoryUrl },
          { name: post.title, url: articleUrl },
        ]}
      />

      <FAQJsonLd items={faqItems} />

      <article>
        <header>
          <h1>{post.title}</h1>
          <p className="article-meta">
            {t("blog.author")}: <strong>{post.author}</strong> ·{" "}
            {t("blog.publishedAt")}: {post.date}
          </p>
          {post.tags && (
            <ul className="tags">
              {post.tags.map((tag) => (
                <li key={tag}>#{tag}</li>
              ))}
            </ul>
          )}
        </header>

        <div
          className="article-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>

      <RelatedPosts
        locale={locale}
        currentSlug={slug}
        labels={{
          heading: t("related.heading"),
          readMore: t("related.readMore"),
        }}
      />
    </>
  );
}
