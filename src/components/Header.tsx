"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";

/*
 * SEO-ПОЯСНЕННЯ: Семантичний HTML — <header> та <nav>
 *
 * Що: <header> — семантичний тег для шапки сайту.
 *   <nav> — семантичний тег для навігації.
 * Навіщо: Google використовує семантичні теги щоб зрозуміти структуру сторінки.
 *   <nav> допомагає пошуковому роботу знайти основні розділи сайту.
 * Як впливає: Правильна семантика покращує розуміння сайту пошуковими
 *   системами та допомагає формувати sitelinks в результатах пошуку.
 */

export default function Header({ locale }: { locale: string }) {
  const { t } = useTranslation();

  return (
    <header>
      <nav aria-label="Main navigation">
        <Link href={`/${locale}`} className="site-logo">
          TechPulse
        </Link>
        <ul>
          <li>
            <Link href={`/${locale}`}>{t("nav.home")}</Link>
          </li>
          <li>
            <Link href={`/${locale}/blog`}>{t("nav.blog")}</Link>
          </li>
        </ul>
        <LanguageSwitcher locale={locale} />
      </nav>
    </header>
  );
}
