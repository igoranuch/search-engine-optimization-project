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

  const flagSrc =
    otherLocale === "uk"
      ? "https://flagcdn.com/w40/ua.png"
      : "https://flagcdn.com/w40/gb.png";
  const flagAlt = otherLocale === "uk" ? "Українська" : "English";

  return (
    <Link href={switchedPath} className="lang-switcher" title={flagAlt}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={flagSrc} alt={flagAlt} width={24} height={16} />
    </Link>
  );
}
