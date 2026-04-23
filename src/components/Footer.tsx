import Link from "next/link";

/*
 * SEO-ПОЯСНЕННЯ: Footer з внутрішніми посиланнями (Internal Linking)
 *
 * Що: Внутрішні посилання — це посилання між сторінками одного сайту.
 * Навіщо: Google розподіляє "link equity" (PageRank) між сторінками через
 *   внутрішні посилання. Footer з посиланнями на всі ключові категорії
 *   гарантує що Google-бот знайде ці сторінки з будь-якої точки сайту.
 * Як впливає:
 *   1. Crawlability — Google легко обходить весь сайт.
 *   2. PageRank distribution — головні категорії отримують частину "ваги"
 *      з кожної статті через footer-посилання.
 *   3. Anchor text — слова у посиланнях ("Builds", "CPUs") підказують
 *      Google про що ця цільова сторінка.
 */

const YEAR = new Date().getFullYear();

const CATEGORIES = [
  { key: "news", en: "News", uk: "Новини" },
  { key: "builds", en: "Builds", uk: "Збірки" },
  { key: "reviews", en: "Reviews", uk: "Огляди" },
] as const;

const COMPONENTS = [
  { key: "cpu", en: "CPUs", uk: "Процесори" },
  { key: "gpu", en: "GPUs", uk: "Відеокарти" },
  { key: "ram", en: "Memory", uk: "Пам'ять" },
  { key: "storage/ssd", en: "SSD", uk: "SSD" },
] as const;

export default function Footer({ locale }: { locale: string }) {
  const isUk = locale === "uk";

  return (
    <footer>
      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-about">
            <p className="footer-brand">GearForge</p>
            <p className="footer-tagline">
              {isUk
                ? "Огляди комплектуючих, бенчмарки та новини ПК"
                : "Hardware reviews, benchmarks and PC news"}
            </p>
          </div>

          {/* Посилання на категорії — покращують internal linking */}
          <nav className="footer-nav" aria-label={isUk ? "Категорії" : "Categories"}>
            <p className="footer-nav-title">
              {isUk ? "Категорії" : "Categories"}
            </p>
            <ul>
              {CATEGORIES.map((c) => (
                <li key={c.key}>
                  <Link href={`/${locale}/${c.key}`}>
                    {isUk ? c.uk : c.en}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Посилання на підкатегорії компонентів */}
          <nav className="footer-nav" aria-label={isUk ? "Компоненти" : "Components"}>
            <p className="footer-nav-title">
              {isUk ? "Компоненти" : "Components"}
            </p>
            <ul>
              {COMPONENTS.map((c) => (
                <li key={c.key}>
                  <Link href={`/${locale}/components/${c.key}`}>
                    {isUk ? c.uk : c.en}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="footer-bottom">
          <p>
            © {YEAR} GearForge.{" "}
            {isUk ? "Всі права захищені." : "All rights reserved."}
          </p>
          {/* hreflang-навігація в footer — додаткова точка переходу між мовами */}
          <div className="footer-langs">
            <Link href="/en">EN</Link>
            <Link href="/uk">UK</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
