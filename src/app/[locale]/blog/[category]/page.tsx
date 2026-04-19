import { notFound } from "next/navigation";
import { getPostsByCategory, CATEGORIES } from "@/lib/posts";
import type { Category } from "@/lib/posts";
import { generatePageMetadata } from "@/lib/seo";
import { getTranslation } from "@/i18n/config";
import ArticleCard from "@/components/ArticleCard";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ locale: string; category: string }>;
};

const CATEGORY_LOCALES: Record<
  Category,
  { uk: { title: string; description: string }; en: { title: string; description: string } }
> = {
  components: {
    uk: {
      title: "Компоненти — огляди та порівняння",
      description: "Огляди та порівняння CPU, GPU, RAM, SSD та інших комплектуючих для ігрового ПК",
    },
    en: {
      title: "Components — Reviews & Comparisons",
      description: "Reviews and comparisons of CPUs, GPUs, RAM, SSDs and other PC gaming components",
    },
  },
  builds: {
    uk: {
      title: "Збірки — готові конфігурації ПК",
      description: "Готові збірки ігрових ПК для різних бюджетів: від бюджетних до топових конфігурацій",
    },
    en: {
      title: "Builds — PC Build Guides",
      description: "Complete gaming PC build guides for every budget, from entry-level to high-end configurations",
    },
  },
};

export async function generateStaticParams() {
  const locales = ["uk", "en"];
  return locales.flatMap((locale) =>
    CATEGORIES.map((category) => ({ locale, category }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, category } = await params;

  if (!CATEGORIES.includes(category as Category)) return {};

  const meta = CATEGORY_LOCALES[category as Category][locale as "uk" | "en"];

  return generatePageMetadata({
    title: `${meta.title} — GearForge`,
    description: meta.description,
    locale,
    path: `/blog/${category}`,
  });
}

export default async function CategoryPage({ params }: Props) {
  const { locale, category } = await params;

  if (!CATEGORIES.includes(category as Category)) notFound();

  const posts = getPostsByCategory(locale, category as Category);
  const { t } = await getTranslation(locale);
  const meta = CATEGORY_LOCALES[category as Category][locale as "uk" | "en"];

  return (
    <section>
      <h1>{meta.title}</h1>
      <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>
        {meta.description}
      </p>
      {posts.length === 0 && <p>{t("blog.noPosts")}</p>}
      {posts.map((post) => (
        <ArticleCard key={post.slug} post={post} locale={locale} />
      ))}
    </section>
  );
}
