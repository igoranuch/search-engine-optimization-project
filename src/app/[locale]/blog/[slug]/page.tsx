import { notFound } from "next/navigation";
import { getPostBySlug, getAllPostSlugs } from "@/lib/posts";
import { generatePageMetadata } from "@/lib/seo";
import { getTranslation } from "@/i18n/config";
import ArticleJsonLd from "@/components/seo/JsonLd";
import RelatedPosts from "@/components/RelatedPosts";
import type { Metadata } from "next";
import { BASE_URL } from "@/lib/config";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getPostBySlug(locale, slug);

  if (!post) return {};

  return generatePageMetadata({
    title: `${post.title} — GearForge`,
    description: post.description,
    locale,
    path: `/blog/${slug}`,
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
  const params: { locale: string; slug: string }[] = [];

  for (const locale of locales) {
    const slugs = getAllPostSlugs(locale);
    for (const slug of slugs) {
      params.push({ locale, slug });
    }
  }

  return params;
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  const post = getPostBySlug(locale, slug);
  const { t } = await getTranslation(locale);

  if (!post) notFound();

  return (
    <>
      <ArticleJsonLd
        title={post.title}
        description={post.description}
        date={post.date}
        author={post.author}
        url={`${BASE_URL}/${locale}/blog/${slug}`}
        image={post.image}
      />

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

        {/* dangerouslySetInnerHTML — рендеримо HTML-контент статті.
            Контент зберігається у наших власних .html файлах, тому це безпечно. */}
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
