import { getTranslation } from "@/i18n/config";
import { generatePageMetadata } from "@/lib/seo";
import { getAllPosts } from "@/lib/posts";
import ArticleCard from "@/components/ArticleCard";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { t } = await getTranslation(locale);

  return generatePageMetadata({
    title: t("site.title"),
    description: t("site.description"),
    locale,
    path: "",
  });
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const { t } = await getTranslation(locale);
  const posts = getAllPosts(locale);

  return (
    <section>
      <h1>{t("home.heading")}</h1>
      {posts.length === 0 && <p>Coming soon...</p>}
      {posts.map((post) => (
        <ArticleCard key={post.slug} post={post} locale={locale} />
      ))}
    </section>
  );
}
