"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeSwitcher from "./ThemeSwitcher";

const FLAT_ITEMS = ["cpu", "gpu", "ram", "motherboards"] as const;
const STORAGE_ITEMS = ["ssd", "hdd"] as const;

export default function Header({ locale }: { locale: string }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [storageOpen, setStorageOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function closeAll() {
    setMenuOpen(false);
    setOpen(false);
    setStorageOpen(false);
  }

  return (
    <header>
      <nav aria-label="Main navigation">
        <Link href={`/${locale}`} className="site-logo">
          GearForge
        </Link>

        <ul className={menuOpen ? "nav-open" : undefined}>
          <li>
            <Link href={`/${locale}`} onClick={closeAll}>{t("nav.home")}</Link>
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
                    <Link href={`/${locale}/components/${key}`} onClick={closeAll}>
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
                            onClick={closeAll}
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
                    <Link href={`/${locale}/components/${key}`} onClick={closeAll}>
                      {t(`subcategories.${key}`)}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>

          <li>
            <Link href={`/${locale}/builds`} onClick={closeAll}>{t("categories.builds")}</Link>
          </li>
          <li>
            <Link href={`/${locale}/news`} onClick={closeAll}>{t("categories.news")}</Link>
          </li>
        </ul>

        <div className="header-actions">
          <ThemeSwitcher />
          <LanguageSwitcher locale={locale} />
          <button
            className="nav-hamburger"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <line x1="3" y1="7" x2="21" y2="7" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="17" x2="21" y2="17" />
              </svg>
            )}
          </button>
        </div>
      </nav>
    </header>
  );
}
