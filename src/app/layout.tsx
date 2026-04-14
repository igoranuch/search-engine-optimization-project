import { headers } from "next/headers";
import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}
