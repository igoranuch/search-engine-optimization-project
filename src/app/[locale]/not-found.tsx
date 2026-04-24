import Link from "next/link";
import type { Metadata } from "next";

/*
 * SEO-ПОЯСНЕННЯ: noindex на 404 сторінках
 *
 * Що: robots: { index: false } додає <meta name="robots" content="noindex">.
 * Навіщо: 404-сторінка рендериться всередині [locale]/layout.tsx, який генерує
 *   canonical що вказує на homepage (/en або /uk). Google бачить контент 404
 *   + canonical на головну → вирішує що це "дублікат" головної сторінки.
 *   noindex повністю вирішує проблему — Google бачить сторінку, але одразу
 *   ігнорує її для індексації.
 *
 * Важливо: noindex ≠ URL зник з індексу одразу. Google має перекраулити
 *   сторінку щоб побачити noindex тег. Для прискорення — GSC URL Removal Tool.
 *
 * "Soft 404" vs "Hard 404":
 *   - Hard 404: сервер повертає HTTP 404 статус (Next.js not-found.tsx робить це автоматично)
 *   - Soft 404: сторінка повертає HTTP 200 з текстом "не знайдено" — Google ненавидить це,
 *     бо не може відрізнити від реального контенту. Next.js not-found.tsx завжди hard 404.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function LocaleNotFound() {
  return (
    <div className="not-found">
      <p className="not-found__code">404</p>
      <h1>Page not found</h1>
      <p>The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
      <div className="not-found__links">
        <Link href="/en">← Back to home (EN)</Link>
        <Link href="/uk">← На головну (UK)</Link>
      </div>
    </div>
  );
}
