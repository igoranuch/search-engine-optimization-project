"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeSwitcher from "./ThemeSwitcher";

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
          GearForge
        </Link>
        <ul>
          <li>
            <Link href={`/${locale}`}>{t("nav.home")}</Link>
          </li>
          <li>
            <Link href={`/${locale}/blog/components`}>
              {t("categories.components")}
            </Link>
          </li>
          <li>
            <Link href={`/${locale}/blog/builds`}>
              {t("categories.builds")}
            </Link>
          </li>
        </ul>
        <div className="header-actions">
          <ThemeSwitcher />
          <LanguageSwitcher locale={locale} />
        </div>
      </nav>
    </header>
  );
}
