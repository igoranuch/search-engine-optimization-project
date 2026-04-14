import "./globals.css";
import { getLocale } from "next-intl/server";

/*
 * SEO-ПОЯСНЕННЯ: Атрибут lang на <html>
 *
 * Що: <html lang="uk"> або <html lang="en"> — вказує мову сторінки.
 * Навіщо: Пошукові системи та screen readers використовують цей атрибут
 *   щоб правильно визначити мову контенту.
 * Як впливає: Допомагає Google показувати сторінку правильній аудиторії.
 *   Також покращує доступність (accessibility).
 */
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();

  return (
    <html lang={locale}>
      <body>{children}</body>
    </html>
  );
}
