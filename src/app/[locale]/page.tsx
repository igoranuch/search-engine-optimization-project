import Link from "next/link";
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
  // Показуємо тільки 3 останні статті на головній
  const latestPosts = getAllPosts(locale).slice(0, 3);

  return (
    <>
      {/* Hero-секція — унікальний контент головної, якого немає на /blog */}
      <section className="hero">
        <h1 className="hero-title">GearForge</h1>
        <p className="hero-subtitle">{t("home.heroSubtitle")}</p>
      </section>

      {/* Останні 3 статті */}
      <section>
        <h2 className="section-heading">{t("home.heading")}</h2>
        {latestPosts.map((post) => (
          <ArticleCard key={post.slug} post={post} locale={locale} />
        ))}
        <Link href={`/${locale}/blog`} className="view-all-link">
          {t("home.viewAll")}
        </Link>
      </section>
    </>
  );
}
