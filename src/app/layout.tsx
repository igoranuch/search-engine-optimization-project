import { headers } from "next/headers";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from "next/script";
import type { Metadata, Viewport } from "next";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/JsonLd";
import "./globals.css";

/*
 * SEO-ПОЯСНЕННЯ: Google Search Console verification
 *
 * Що: <meta name="google-site-verification"> — підтвердження права власності на сайт.
 * Навіщо: Google Search Console потребує верифікації перш ніж показувати дані
 *   про індексацію, кліки, позиції та помилки сайту.
 * Як впливає: Без верифікації недоступні дані про органічний трафік та помилки
 *   сканування. Після верифікації можна подати sitemap і відстежувати ранжування.
 */
export const metadata: Metadata = {
  metadataBase: new URL("https://gearforge.blog"),
  verification: {
    google: "qkPKH-3cSzUDiFRLo8z9U-d6oKYz30p_CEEGzcAH9Io",
  },
};

/*
 * SEO-ПОЯСНЕННЯ: Viewport та themeColor
 *
 * Що: viewport визначає як браузер масштабує сторінку на мобільних пристроях.
 *   themeColor задає колір UI браузера (рядок адреси) на Android і PWA.
 * Навіщо: Google використовує Mobile-First Indexing — він спочатку сканує
 *   мобільну версію сайту. Без viewport мета-тега контент може виглядати
 *   як "десктопний" на телефоні, що погіршує Mobile Usability Score.
 * Як впливає: Поганий мобільний UX = вищий bounce rate = нижчі позиції.
 *   Правильний viewport = Google бачить ту ж версію, що й мобільний користувач.
 *
 * У Next.js 15 viewport виноситься в окремий export (не metadata),
 * щоб уникнути конфліктів між layout та сторінками.
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f1419" },
  ],
};

/*
 * SEO-ПОЯСНЕННЯ: Атрибут lang на <html>
 *
 * Що: <html lang="uk"> або <html lang="en"> — вказує мову сторінки.
 * Навіщо: Пошукові системи та screen readers використовують цей атрибут
 *   щоб правильно визначити мову контенту.
 * Як впливає: Допомагає Google показувати сторінку правильній аудиторії.
 */
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Читаємо локаль з заголовка, встановленого middleware
  const locale = (await headers()).get("x-locale") || "en";

  /*
   * Inline-скрипт нижче виконується ДО першого рендеру body. Він читає
   * збережену тему з localStorage (або системну prefers-color-scheme) і
   * ставить data-theme на <html>. Це запобігає "спалаху" світлої теми при
   * перезавантаженні сторінки, коли користувач обрав темну.
   */
  const themeInitScript = `(function(){try{var t=localStorage.getItem('theme');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        {/* Site-wide structured data — присутні на кожній сторінці */}
        <OrganizationJsonLd />
        <WebSiteJsonLd />
      </head>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />

        {/*
         * SEO-ПОЯСНЕННЯ: Google Analytics 4 (GA4)
         *
         * Що: GA4 — система веб-аналітики Google що відстежує поведінку користувачів:
         *   які сторінки переглядають, скільки часу проводять, звідки прийшли.
         * Навіщо: GA4 ≠ SEO-інструмент напряму, але надає дані що впливають на SEO-рішення:
         *   - Bounce rate та Engagement rate — показують чи задовольняє контент запит
         *   - Organic traffic — скільки користувачів прийшло з пошуку
         *   - Landing pages — які сторінки найефективніші в пошуку
         *   - User behavior — що роблять після переходу з Google
         * Як впливає: GA4 ≠ GSC. Google Search Console показує як Google бачить сайт
         *   (impressions, CTR, позиції). GA4 показує що роблять реальні користувачі
         *   після кліку. Разом вони дають повну картину воронки пошукового трафіку.
         *
         * strategy="afterInteractive" — скрипт завантажується після того як сторінка
         * стала інтерактивною. Це не блокує рендеринг і не погіршує Core Web Vitals
         * (LCP, FID/INP) — на відміну від звичайного <script> в <head>.
         */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-J30JT9KJFM"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-J30JT9KJFM');
          `}
        </Script>
      </body>
    </html>
  );
}
