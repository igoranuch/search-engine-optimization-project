import type { Metadata } from "next";

/*
 * SEO-ПОЯСНЕННЯ: Metadata API в Next.js
 *
 * Що: Next.js має вбудований Metadata API для генерації <title>, <meta>,
 *   Open Graph тегів та інших SEO-елементів.
 * Навіщо: Мета-теги — це перше, що бачить Google при індексації сторінки.
 *   <title> та <meta description> відображаються прямо в результатах пошуку.
 * Як впливає: Якісний title та description підвищують CTR (click-through rate) —
 *   відсоток користувачів, які клікають на твій результат в пошуку.
 *
 * Open Graph теги потрібні для коректного відображення при поширенні
 * посилання в соціальних мережах (Facebook, Twitter, Telegram тощо).
 */

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

type SeoParams = {
  title: string;
  description: string;
  locale: string;
  path: string;
  image?: string;
};

export function generatePageMetadata({
  title,
  description,
  locale,
  path,
  image,
}: SeoParams): Metadata {
  const url = `${BASE_URL}/${locale}${path}`;
  return {
    title,
    description,

    /*
     * SEO-ПОЯСНЕННЯ: hreflang (alternates)
     *
     * Що: Тег <link rel="alternate" hreflang="uk" href="..."> вказує Google,
     *   що існує версія цієї сторінки іншою мовою.
     * Навіщо: Без hreflang Google може вважати українську та англійську версії
     *   дублікатами і показувати лише одну. З hreflang — кожна мовна версія
     *   з'являється для відповідної аудиторії.
     * Як впливає: Українські користувачі бачать UA-версію, англійські — EN-версію.
     */
    alternates: {
      canonical: url,
      languages: {
        uk: `${BASE_URL}/uk${path}`,
        en: `${BASE_URL}/en${path}`,
      },
    },

    openGraph: {
      title,
      description,
      url,
      siteName: "TechPulse",
      locale: locale === "uk" ? "uk_UA" : "en_US",
      type: "website",
      ...(image && { images: [{ url: image, width: 1200, height: 630 }] }),
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
