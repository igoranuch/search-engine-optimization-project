import Link from "next/link";

/*
 * SEO-ПОЯСНЕННЯ: Видимі хлібні крихти (Visible Breadcrumbs)
 *
 * Що: Хлібні крихти — навігаційний UI-елемент що показує ієрархічний шлях
 *   до поточної сторінки. Наприклад: Головна › Новини › Назва статті.
 * Навіщо: Виконують подвійну функцію:
 *   1. UX — користувач розуміє де він знаходиться і може легко повернутись назад.
 *      Нижчий bounce rate = позитивний поведінковий сигнал для Google.
 *   2. SEO — Google зчитує HTML-хлібні крихти і відображає їх замість URL
 *      у результатах пошуку. Разом з BreadcrumbList JSON-LD схемою Google
 *      отримує подвійне підтвердження ієрархії.
 * Як впливає: Кращий вигляд сніпету у SERP = вищий CTR.
 *   aria-label="Breadcrumb" + aria-current="page" покращують доступність,
 *   що Google також враховує при ранжуванні.
 */

type BreadcrumbItem = {
  name: string;
  href: string;
};

type Props = {
  items: BreadcrumbItem[];
};

export default function Breadcrumbs({ items }: Props) {
  return (
    <nav aria-label="Breadcrumb" className="breadcrumbs">
      <ol>
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={i}>
              {isLast ? (
                <span aria-current="page">{item.name}</span>
              ) : (
                <Link href={item.href}>{item.name}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
