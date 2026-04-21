import { notFound } from "next/navigation";
import { getPostsBySubcategory, STORAGE_TYPES } from "@/lib/posts";
import type { ComponentSubcategory } from "@/lib/posts";
import { generatePageMetadata } from "@/lib/seo";
import { getTranslation } from "@/i18n/config";
import ArticleCard from "@/components/ArticleCard";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ locale: string; storageType: string }>;
};

const META: Record<string, { uk: { title: string; description: string }; en: { title: string; description: string } }> = {
  ssd: {
    uk: { title: "SSD накопичувачі", description: "Огляди NVMe PCIe 4.0/5.0 SSD та порівняння швидкості читання й запису" },
    en: { title: "SSD Drives", description: "NVMe PCIe 4.0/5.0 SSD reviews and read/write speed comparisons" },
  },
  hdd: {
    uk: { title: "HDD жорсткі диски", description: "Огляди та порівняння жорстких дисків для зберігання даних" },
    en: { title: "HDD Hard Drives", description: "Hard drive reviews and comparisons for data storage" },
  },
};

export async function generateStaticParams() {
  const locales = ["uk", "en"];
  return locales.flatMap((locale) =>
    STORAGE_TYPES.map((storageType) => ({ locale, storageType }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, storageType } = await params;
  const meta = META[storageType]?.[locale as "uk" | "en"];
  if (!meta) return {};
  return generatePageMetadata({
    title: `${meta.title} — GearForge`,
    description: meta.description,
    locale,
    path: `/components/storage/${storageType}`,
  });
}

export default async function StorageTypePage({ params }: Props) {
  const { locale, storageType } = await params;

  if (!STORAGE_TYPES.includes(storageType as ComponentSubcategory)) notFound();

  const posts = getPostsBySubcategory(locale, storageType as ComponentSubcategory);
  const { t } = await getTranslation(locale);
  const meta = META[storageType]?.[locale as "uk" | "en"];
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
