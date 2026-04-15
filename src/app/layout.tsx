import { headers } from "next/headers";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
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
  const locale = (await headers()).get("x-locale") || "uk";

  return (
    <html lang={locale}>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
