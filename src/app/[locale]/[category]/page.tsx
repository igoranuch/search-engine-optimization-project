import { notFound } from "next/navigation";
import { getPostsByCategory, CATEGORIES } from "@/lib/posts";
import type { Category } from "@/lib/posts";
import { generatePageMetadata } from "@/lib/seo";
import { getTranslation } from "@/i18n/config";
import ArticleCard from "@/components/ArticleCard";
import type { Metadata } from "next";

type FlatCategory = "builds" | "news" | "reviews";
const FLAT_CATEGORIES = CATEGORIES.filter((c) => c !== "components") as FlatCategory[];

type Props = {
  params: Promise<{ locale: string; category: string }>;
};

const CATEGORY_META: Record<
  string,
  { uk: { title: string; description: string }; en: { title: string; description: string } }
> = {
  builds: {
    uk: { title: "Збірки — готові конфігурації ПК", description: "Готові збірки ігрових ПК для різних бюджетів: від бюджетних до топових конфігурацій" },
    en: { title: "Builds — PC Build Guides", description: "Complete gaming PC build guides for every budget, from entry-level to high-end" },
  },
  news: {
    uk: { title: "Новини — ринок ПК та залізо", description: "Новини ринку ПК, тенденції галузі, анонси заліза та все що важливо знати ентузіасту" },
    en: { title: "News — PC Market & Hardware", description: "PC industry news, market trends, hardware launches and everything enthusiasts need to know" },
  },
  reviews: {
    uk: { title: "Огляди — детальні тести заліза", description: "Детальні огляди відеокарт, процесорів та іншого заліза з реальними бенчмарками" },
    en: { title: "Reviews — In-Depth Hardware Tests", description: "In-depth GPU, CPU and hardware reviews with real-world benchmarks and gaming tests" },
  },
};

export async function generateStaticParams() {
  const locales = ["uk", "en"];
  return locales.flatMap((locale) =>
    FLAT_CATEGORIES.map((category) => ({ locale, category }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, category } = await params;
  const meta = CATEGORY_META[category]?.[locale as "uk" | "en"];
  if (!meta) return {};

  return generatePageMetadata({
    title: `${meta.title} — GearForge`,
    description: meta.description,
    locale,
    path: `/${category}`,
  });
}

export default async function CategoryPage({ params }: Props) {
  const { locale, category } = await params;

  if (!FLAT_CATEGORIES.includes(category as FlatCategory)) notFound();

  const posts = getPostsByCategory(locale, category as FlatCategory);
  const { t } = await getTranslation(locale);
  const meta = CATEGORY_META[category]?.[locale as "uk" | "en"];

  if (!meta) notFound();

  return (
    <section>
      <h1>{meta.title}</h1>
      <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>{meta.description}</p>
      {posts.length === 0 && <p>{t("blog.noPosts")}</p>}
      {posts.map((post) => (
        <ArticleCard key={post.slug} post={post} locale={locale} />
      ))}
    </section>
  );
}
