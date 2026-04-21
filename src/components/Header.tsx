"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
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

const FLAT_ITEMS = ["cpu", "gpu", "ram", "motherboards"] as const;
const STORAGE_ITEMS = ["ssd", "hdd"] as const;

export default function Header({ locale }: { locale: string }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [storageOpen, setStorageOpen] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

          {/* Components — click-toggled dropdown */}
          <li className="nav-dropdown" ref={dropdownRef}>
            <span
              className="nav-dropdown__trigger"
              onClick={() => setOpen((v) => !v)}
            >
              {t("categories.components")}
            </span>
            {open && (
              <ul className="nav-dropdown__menu">
                {FLAT_ITEMS.slice(0, 3).map((key) => (
                  <li key={key}>
                    <Link href={`/${locale}/components/${key}`} onClick={() => setOpen(false)}>
                      {t(`subcategories.${key}`)}
                    </Link>
                  </li>
                ))}

                {/* Storage — click-toggled nested dropdown */}
                <li className="nav-dropdown__nested">
                  <span
                    className="nav-dropdown__nested-trigger"
                    onClick={() => setStorageOpen((v) => !v)}
                  >
                    {t("subcategories.storage")}
                  </span>
                  {storageOpen && (
                    <ul className="nav-dropdown__submenu">
                      {STORAGE_ITEMS.map((type) => (
                        <li key={type}>
                          <Link
                            href={`/${locale}/components/storage/${type}`}
                            onClick={() => { setOpen(false); setStorageOpen(false); }}
                          >
                            {t(`subcategories.${type}`)}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>

                {FLAT_ITEMS.slice(3).map((key) => (
                  <li key={key}>
                    <Link href={`/${locale}/components/${key}`} onClick={() => setOpen(false)}>
                      {t(`subcategories.${key}`)}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>

          <li>
            <Link href={`/${locale}/builds`}>{t("categories.builds")}</Link>
          </li>
          <li>
            <Link href={`/${locale}/news`}>{t("categories.news")}</Link>
          </li>
          <li>
            <Link href={`/${locale}/reviews`}>{t("categories.reviews")}</Link>
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
