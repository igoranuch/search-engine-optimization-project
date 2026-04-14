"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

/*
 * SEO-ПОЯСНЕННЯ: Перемикач мов та hreflang
 *
 * Що: Перемикач мов дозволяє користувачу змінити мову сторінки.
 * Навіщо: Google рекомендує надавати чіткі посилання між мовними версіями.
 *   Це допомагає пошуковому роботу знайти всі мовні версії сторінки.
 * Як впливає: Покращує user experience та допомагає Google
 *   правильно індексувати мовні версії.
 */

export default function LanguageSwitcher({ locale }: { locale: string }) {
  const pathname = usePathname();
  const otherLocale = locale === "uk" ? "en" : "uk";

  // Замінюємо поточну мову в URL на іншу: /uk/blog → /en/blog
  const switchedPath = pathname.replace(`/${locale}`, `/${otherLocale}`);

  return (
    <Link href={switchedPath}>
      {otherLocale === "uk" ? "🇺🇦 UA" : "🇬🇧 EN"}
    </Link>
  );
}
