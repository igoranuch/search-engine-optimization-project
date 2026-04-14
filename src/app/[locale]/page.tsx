import { getTranslations } from "next-intl/server";
import { generatePageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "site" });

  return generatePageMetadata({
    title: t("title"),
    description: t("description"),
    locale,
    path: "",
  });
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });

  return (
    <section>
      <h1>{t("heading")}</h1>
      <p>Coming soon...</p>
    </section>
  );
}
