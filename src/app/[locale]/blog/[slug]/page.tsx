import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getPostBySlug, getAllPostSlugs } from "@/lib/posts";
import { generatePageMetadata } from "@/lib/seo";
import { getTranslations } from "next-intl/server";
import ArticleJsonLd from "@/components/seo/JsonLd";
import type { Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getPostBySlug(locale, slug);

  if (!post) return {};

  return generatePageMetadata({
    title: `${post.title} — TechPulse`,
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
  const t = await getTranslations({ locale, namespace: "blog" });

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
          <p>
            {t("author")}: {post.author} · {t("publishedAt")}: {post.date} · {post.readingTime}
          </p>
          {post.tags && (
            <ul style={{ display: "flex", gap: "0.5rem", listStyle: "none" }}>
              {post.tags.map((tag) => (
                <li key={tag}>#{tag}</li>
              ))}
            </ul>
          )}
        </header>

        <MDXRemote source={post.content} />
      </article>
    </>
  );
}
