import { notFound } from "next/navigation";
import { getPostBySlug, getStoragePostsForStaticParams, STORAGE_TYPES } from "@/lib/posts";
import type { ComponentSubcategory } from "@/lib/posts";
import { generatePageMetadata } from "@/lib/seo";
import { getTranslation } from "@/i18n/config";
import ArticleJsonLd, { BreadcrumbJsonLd, FAQJsonLd, extractFAQItems } from "@/components/seo/JsonLd";
import RelatedPosts from "@/components/RelatedPosts";
import type { Metadata } from "next";
import { BASE_URL } from "@/lib/config";

type Props = {
  params: Promise<{ locale: string; storageType: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, storageType, slug } = await params;
  const post = getPostBySlug(locale, slug);
  if (!post) return {};
  return generatePageMetadata({
    title: `${post.title} — GearForge`,
    description: post.description,
    locale,
    path: `/components/storage/${storageType}/${slug}`,
    image: post.image,
  });
}

export async function generateStaticParams() {
  const locales = ["uk", "en"];
  const result: { locale: string; storageType: string; slug: string }[] = [];
  for (const locale of locales) {
    for (const { slug, storageType } of getStoragePostsForStaticParams(locale)) {
      result.push({ locale, storageType, slug });
    }
  }
  return result;
}

export default async function StorageArticlePage({ params }: Props) {
  const { locale, storageType, slug } = await params;

  if (!STORAGE_TYPES.includes(storageType as ComponentSubcategory)) notFound();

  const post = getPostBySlug(locale, slug);
  const { t } = await getTranslation(locale);

  if (!post || post.category !== "components" || post.subcategory !== storageType) notFound();

  const articleUrl = `${BASE_URL}/${locale}/components/storage/${storageType}/${slug}`;
  const storageTypeUrl = `${BASE_URL}/${locale}/components/storage/${storageType}`;
  const faqItems = extractFAQItems(post.content);

  const typeName = storageType.toUpperCase();

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
          { name: locale === "uk" ? "Комплектуючі" : "Components", url: `${BASE_URL}/${locale}/components/storage/${storageType}` },
          { name: typeName, url: storageTypeUrl },
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
