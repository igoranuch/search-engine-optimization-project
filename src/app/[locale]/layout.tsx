import { notFound } from "next/navigation";
import { getTranslation } from "@/i18n/config";
import { generatePageMetadata } from "@/lib/seo";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import I18nProvider from "@/components/I18nProvider";
import type { Metadata } from "next";

const LOCALES = ["uk", "en"];

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { t } = await getTranslation(locale);

  return generatePageMetadata({
    title: t("site.title"),
    description: t("site.description"),
    locale,
    path: "",
  });
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!LOCALES.includes(locale)) notFound();

  return (
    // I18nProvider передає активну мову клієнтським компонентам (Header, ArticleCard)
    <I18nProvider locale={locale}>
      <Header locale={locale} />
      <main>{children}</main>
      <Footer locale={locale} />
    </I18nProvider>
  );
}
