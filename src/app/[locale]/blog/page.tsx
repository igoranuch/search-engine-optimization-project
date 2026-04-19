import { getPostsByCategory } from "@/lib/posts";
import { getTranslation } from "@/i18n/config";
import { generatePageMetadata } from "@/lib/seo";
import ArticleCard from "@/components/ArticleCard";
import Link from "next/link";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { t } = await getTranslation(locale);

  return generatePageMetadata({
    title: `${t("nav.blog")} — GearForge`,
    description: t("blog.description"),
    locale,
    path: "/blog",
  });
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  const { t } = await getTranslation(locale);

  const components = getPostsByCategory(locale, "components");
  const builds = getPostsByCategory(locale, "builds");

  const categories = [
    {
      key: "components" as const,
      label: t("categories.components"),
      description: t("categories.componentsDesc"),
      posts: components,
    },
    {
      key: "builds" as const,
      label: t("categories.builds"),
      description: t("categories.buildsDesc"),
      posts: builds,
    },
  ];

  return (
    <section>
      <h1>{t("nav.blog")}</h1>

      {categories.map(({ key, label, description, posts }) => (
        <section key={key} className="blog-category-section">
          <div className="blog-category-header">
            <div>
              <h2 className="blog-category-title">{label}</h2>
              <p className="blog-category-desc">{description}</p>
            </div>
            <Link href={`/${locale}/blog/${key}`} className="blog-category-link">
              {t("blog.viewAll")} →
            </Link>
          </div>
          {posts.slice(0, 3).map((post) => (
            <ArticleCard key={post.slug} post={post} locale={locale} />
          ))}
          {posts.length > 3 && (
            <Link href={`/${locale}/blog/${key}`} className="read-more">
              {t("blog.viewAll")} ({posts.length}) →
            </Link>
          )}
        </section>
      ))}
    </section>
  );
}
