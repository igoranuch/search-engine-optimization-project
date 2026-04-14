import { getAllPosts } from "@/lib/posts";
import { getTranslation } from "@/i18n/config";
import { generatePageMetadata } from "@/lib/seo";
import ArticleCard from "@/components/ArticleCard";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { t } = await getTranslation(locale);

  return generatePageMetadata({
    title: `${t("nav.blog")} — TechPulse`,
    description: t("blog.description"),
    locale,
    path: "/blog",
  });
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  const posts = getAllPosts(locale);
  const { t } = await getTranslation(locale);

  return (
    <section>
      <h1>{t("nav.blog")}</h1>
      {posts.length === 0 && <p>No posts yet.</p>}
      {posts.map((post) => (
        <ArticleCard key={post.slug} post={post} locale={locale} />
      ))}
    </section>
  );
}
