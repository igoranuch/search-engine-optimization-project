import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { generatePageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

type MetadataProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: MetadataProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "site" });

  return generatePageMetadata({
    title: t("title"),
    description: t("description"),
    locale,
    path: "",
  });
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Header locale={locale} />
      <main>{children}</main>
      <Footer />
    </NextIntlClientProvider>
  );
}
