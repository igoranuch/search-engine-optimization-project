import { notFound } from "next/navigation";
import { getPostBySlug, getPostsForStaticParams, CATEGORIES } from "@/lib/posts";
import type { Category } from "@/lib/posts";
import { generatePageMetadata } from "@/lib/seo";
import { getTranslation } from "@/i18n/config";
import ArticleJsonLd, { BreadcrumbJsonLd, FAQJsonLd, ReviewJsonLd, extractFAQItems } from "@/components/seo/JsonLd";
import Breadcrumbs from "@/components/Breadcrumbs";
import RelatedPosts from "@/components/RelatedPosts";
import type { Metadata } from "next";
import { BASE_URL } from "@/lib/config";

type FlatCategory = "builds" | "news" | "reviews" | "guides";
const FLAT_CATEGORIES = CATEGORIES.filter((c) => c !== "components") as FlatCategory[];

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
    path: `/${category}/${slug}`,
    image: post.image,
  });
}

export async function generateStaticParams() {
  const locales = ["uk", "en"];
  const result: { locale: string; category: string; slug: string }[] = [];

  for (const locale of locales) {
    for (const { slug, category } of getPostsForStaticParams(locale)) {
      result.push({ locale, category, slug });
    }
  }

  return result;
}

export default async function ArticlePage({ params }: Props) {
  const { locale, category, slug } = await params;

  if (!FLAT_CATEGORIES.includes(category as FlatCategory)) notFound();

  const post = getPostBySlug(locale, slug);
  const { t } = await getTranslation(locale);

  if (!post || post.category !== category) notFound();

  const articleUrl = `${BASE_URL}/${locale}/${category}/${slug}`;
  const categoryUrl = `${BASE_URL}/${locale}/${category}`;
  const faqItems = extractFAQItems(post.content);

  const ukNames: Record<FlatCategory, string> = { builds: "Збірки", news: "Новини", reviews: "Огляди", guides: "Гайди" };
  const enNames: Record<FlatCategory, string> = { builds: "Builds", news: "News", reviews: "Reviews", guides: "Guides" };
  const categoryName = locale === "uk"
    ? ukNames[category as FlatCategory] ?? category
    : enNames[category as FlatCategory] ?? category;

  return (
    <>
      {/* Review schema for review articles with rating; Article schema for everything else */}
      {post.category === "reviews" && post.rating && post.reviewedProduct ? (
        <ReviewJsonLd
          title={post.title}
          description={post.description}
          date={post.date}
          author={post.author}
          url={articleUrl}
          rating={post.rating}
          reviewedProduct={post.reviewedProduct}
          image={post.image}
        />
      ) : (
        <ArticleJsonLd
          title={post.title}
          description={post.description}
          date={post.date}
          author={post.author}
          url={articleUrl}
          image={post.image}
        />
      )}
      <BreadcrumbJsonLd
        items={[
          { name: locale === "uk" ? "Головна" : "Home", url: `${BASE_URL}/${locale}` },
          { name: categoryName, url: categoryUrl },
          { name: post.title, url: articleUrl },
        ]}
      />
      <FAQJsonLd items={faqItems} />

      {/*
       * SEO-ПОЯСНЕННЯ: Видимі хлібні крихти
       * Доповнюють BreadcrumbJsonLd — Google бачить і HTML, і JSON-LD.
       * aria-label="Breadcrumb" та aria-current="page" покращують доступність.
       */}
      <Breadcrumbs
        items={[
          { name: locale === "uk" ? "Головна" : "Home", href: `/${locale}` },
          { name: categoryName, href: `/${locale}/${category}` },
          { name: post.title, href: `/${locale}/${category}/${slug}` },
        ]}
      />

      <article>
        <header>
          <h1>{post.title}</h1>
          <p className="article-meta">
            {t("blog.author")}: <strong>{post.author}</strong> ·{" "}
            {t("blog.publishedAt")}: {post.date} ·{" "}
            {t("article.readingTime", { count: post.readingTime })}
          </p>
          {post.tags && (
            <ul className="tags">
              {post.tags.map((tag) => (
                <li key={tag}>#{tag}</li>
              ))}
            </ul>
          )}
        </header>
        <div className="article-content" dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>

      <RelatedPosts
        locale={locale}
        currentSlug={slug}
        labels={{ heading: t("related.heading"), readMore: t("related.readMore") }}
      />
    </>
  );
}
