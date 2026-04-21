import { notFound } from "next/navigation";
import { getPostsBySubcategory, FLAT_SUBCATEGORIES } from "@/lib/posts";
import type { ComponentSubcategory } from "@/lib/posts";
import { generatePageMetadata } from "@/lib/seo";
import { getTranslation } from "@/i18n/config";
import ArticleCard from "@/components/ArticleCard";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ locale: string; subcategory: string }>;
};

const SUBCATEGORY_META: Record<
  ComponentSubcategory,
  { uk: { title: string; description: string }; en: { title: string; description: string } }
> = {
  cpu: {
    uk: { title: "Процесори (CPU)", description: "Огляди та порівняння процесорів Intel і AMD для ігор та роботи" },
    en: { title: "Processors (CPU)", description: "Intel and AMD CPU reviews and comparisons for gaming and work" },
  },
  gpu: {
    uk: { title: "Відеокарти (GPU)", description: "Детальні огляди відеокарт NVIDIA і AMD з бенчмарками в іграх" },
    en: { title: "Graphics Cards (GPU)", description: "In-depth NVIDIA and AMD GPU reviews with gaming benchmarks" },
  },
  ram: {
    uk: { title: "Оперативна пам'ять (RAM)", description: "DDR4 vs DDR5, найкращі планки для ігор та продуктивної роботи" },
    en: { title: "Memory (RAM)", description: "DDR4 vs DDR5, best RAM kits for gaming and productivity" },
  },
  ssd: {
    uk: { title: "SSD накопичувачі", description: "Огляди NVMe PCIe 4.0/5.0 SSD та порівняння швидкості читання й запису" },
    en: { title: "SSD Drives", description: "NVMe PCIe 4.0/5.0 SSD reviews and read/write speed comparisons" },
  },
  hdd: {
    uk: { title: "HDD жорсткі диски", description: "Огляди та порівняння жорстких дисків для зберігання даних" },
    en: { title: "HDD Hard Drives", description: "Hard drive reviews and comparisons for data storage" },
  },
  motherboards: {
    uk: { title: "Материнські плати", description: "Огляди та вибір материнських плат AM5, LGA1851 та інших платформ" },
    en: { title: "Motherboards", description: "AM5, LGA1851 and other platform motherboard reviews and selection" },
  },
};

export async function generateStaticParams() {
  const locales = ["uk", "en"];
  return locales.flatMap((locale) =>
    FLAT_SUBCATEGORIES.map((subcategory) => ({ locale, subcategory }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, subcategory } = await params;
  if (!FLAT_SUBCATEGORIES.includes(subcategory as ComponentSubcategory)) return {};

  const meta = SUBCATEGORY_META[subcategory as ComponentSubcategory][locale as "uk" | "en"];
  return generatePageMetadata({
    title: `${meta.title} — GearForge`,
    description: meta.description,
    locale,
    path: `/components/${subcategory}`,
  });
}

export default async function SubcategoryPage({ params }: Props) {
  const { locale, subcategory } = await params;

  if (!FLAT_SUBCATEGORIES.includes(subcategory as ComponentSubcategory)) notFound();

  const posts = getPostsBySubcategory(locale, subcategory as ComponentSubcategory);
  const { t } = await getTranslation(locale);
  const meta = SUBCATEGORY_META[subcategory as ComponentSubcategory][locale as "uk" | "en"];

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
