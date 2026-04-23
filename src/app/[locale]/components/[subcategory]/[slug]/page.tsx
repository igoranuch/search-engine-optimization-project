import { notFound } from "next/navigation";
import { getPostBySlug, getComponentPostsForStaticParams, FLAT_SUBCATEGORIES } from "@/lib/posts";
import type { ComponentSubcategory } from "@/lib/posts";
import { generatePageMetadata } from "@/lib/seo";
import { getTranslation } from "@/i18n/config";
import ArticleJsonLd, { BreadcrumbJsonLd, FAQJsonLd, extractFAQItems } from "@/components/seo/JsonLd";
import Breadcrumbs from "@/components/Breadcrumbs";
import RelatedPosts from "@/components/RelatedPosts";
import type { Metadata } from "next";
import { BASE_URL } from "@/lib/config";

type Props = {
  params: Promise<{ locale: string; subcategory: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, subcategory, slug } = await params;
  const post = getPostBySlug(locale, slug);
  if (!post) return {};

  return generatePageMetadata({
    title: `${post.title} — GearForge`,
    description: post.description,
    locale,
    path: `/components/${subcategory}/${slug}`,
    image: post.image,
  });
}

export async function generateStaticParams() {
  const locales = ["uk", "en"];
  const result: { locale: string; subcategory: string; slug: string }[] = [];

  for (const locale of locales) {
    for (const { slug, subcategory } of getComponentPostsForStaticParams(locale)) {
      result.push({ locale, subcategory, slug });
    }
  }

  return result;
}

export default async function ComponentArticlePage({ params }: Props) {
  const { locale, subcategory, slug } = await params;

  if (!FLAT_SUBCATEGORIES.includes(subcategory as ComponentSubcategory)) notFound();

  const post = getPostBySlug(locale, slug);
  const { t } = await getTranslation(locale);

  if (!post || post.category !== "components" || post.subcategory !== subcategory) notFound();

  const articleUrl = `${BASE_URL}/${locale}/components/${subcategory}/${slug}`;
  const subcategoryUrl = `${BASE_URL}/${locale}/components/${subcategory}`;
  const faqItems = extractFAQItems(post.content);

  const subcategoryName = locale === "uk"
    ? { cpu: "Процесори", gpu: "Відеокарти", ram: "Пам'ять", ssd: "SSD", hdd: "HDD", motherboards: "Материнські плати" }[subcategory] ?? subcategory
    : { cpu: "CPU", gpu: "GPU", ram: "RAM", ssd: "SSD", hdd: "HDD", motherboards: "Motherboards" }[subcategory] ?? subcategory;

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
          { name: locale === "uk" ? "Комплектуючі" : "Components", url: `${BASE_URL}/${locale}/components` },
          { name: subcategoryName, url: subcategoryUrl },
          { name: post.title, url: articleUrl },
        ]}
      />
      <FAQJsonLd items={faqItems} />

      <Breadcrumbs
        items={[
          { name: locale === "uk" ? "Головна" : "Home", href: `/${locale}` },
          { name: locale === "uk" ? "Компоненти" : "Components", href: `/${locale}/components/${subcategory}` },
          { name: subcategoryName, href: `/${locale}/components/${subcategory}` },
          { name: post.title, href: `/${locale}/components/${subcategory}/${slug}` },
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
