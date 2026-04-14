import { getAllPosts } from "@/lib/posts";
import { getTranslations } from "next-intl/server";
import { generatePageMetadata } from "@/lib/seo";
import ArticleCard from "@/components/ArticleCard";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });

  return generatePageMetadata({
    title: `${t("blog")} — TechPulse`,
    description: locale === "uk"
      ? "Усі статті про комп'ютери, комплектуючі та ігри"
      : "All articles about computers, hardware and games",
    locale,
    path: "/blog",
  });
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  const posts = getAllPosts(locale);
  const t = await getTranslations({ locale, namespace: "nav" });

  return (
    <section>
      <h1>{t("blog")}</h1>
      {posts.length === 0 && <p>No posts yet.</p>}
      {posts.map((post) => (
        <ArticleCard key={post.slug} post={post} locale={locale} />
      ))}
    </section>
  );
}
