import Link from "next/link";

/*
 * SEO-ПОЯСНЕННЯ: Кастомна 404 сторінка
 *
 * Що: 404 (Not Found) — HTTP статус-код що означає "ця сторінка не існує".
 *   Next.js автоматично повертає статус 404 коли цей компонент рендериться.
 * Навіщо: Кастомна 404 важлива з двох причин:
 *   1. Crawl budget — Google виділяє певну кількість запитів для сканування
 *      сайту (crawl budget). Чіткий 404 сигналізує боту що URL мертвий
 *      і не варто повертатись — це зберігає бюджет для живих сторінок.
 *   2. UX — замість порожньої сторінки помилки, користувач бачить навігацію.
 *      Нижчий bounce rate = позитивний поведінковий сигнал для Google.
 * Як впливає: "М'яка 404" (сторінка повертає 200 з текстом "не знайдено")
 *   гірша за справжню 404, бо Google може проіндексувати її як реальний контент.
 *   Next.js not-found.tsx завжди повертає коректний статус 404.
 */

export default function NotFound() {
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
