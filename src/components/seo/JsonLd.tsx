/*
 * SEO-ПОЯСНЕННЯ: JSON-LD Structured Data (Структуровані дані)
 *
 * Що: JSON-LD — це формат для передачі структурованих даних пошуковим системам.
 *   Це невидимий для користувача JSON-блок у <script> тегу на сторінці.
 * Навіщо: Structured Data допомагає Google точно зрозуміти тип контенту:
 *   це стаття? рецепт? товар? відгук? На основі цього Google може показати
 *   розширений сніпет (rich snippet) — з датою, автором, хлібними крихтами,
 *   або розгорнутими FAQ прямо в результатах пошуку.
 * Як впливає: Сторінки з rich snippets мають вищий CTR (до 30% більше кліків),
 *   бо вони візуально виділяються в результатах пошуку.
 */

// ─── Article ────────────────────────────────────────────────────────────────

type ArticleJsonLdProps = {
  title: string;
  description: string;
  date: string;
  author: string;
  url: string;
  image?: string;
};

/*
 * SEO-ПОЯСНЕННЯ: dateModified
 *
 * Що: Поле dateModified вказує коли стаття була востаннє оновлена.
 * Навіщо: Google використовує його для оцінки актуальності контенту.
 *   Свіжий контент отримує "freshness boost" у ранжуванні — особливо важливо
 *   для запитів типу "кращий CPU 2026".
 * Як впливає: Якщо dateModified = сьогодні, Google вважає контент актуальним
 *   і може підняти його вище в результатах пошуку.
 */
export default function ArticleJsonLd({
  title,
  description,
  date,
  author,
  url,
  image,
}: ArticleJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    datePublished: date,
    dateModified: date,
    author: {
      "@type": "Person",
      name: author,
    },
    publisher: {
      "@type": "Organization",
      name: "GearForge",
      url: "https://gearforge.blog",
    },
    url,
    ...(image && {
      image: {
        "@type": "ImageObject",
        url: image,
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// ─── BreadcrumbList ──────────────────────────────────────────────────────────

/*
 * SEO-ПОЯСНЕННЯ: BreadcrumbList (Хлібні крихти)
 *
 * Що: BreadcrumbList — схема що описує ієрархію навігації сторінки.
 *   Приклад: Головна → Блог → Назва статті
 * Навіщо: Google відображає хлібні крихти прямо в результатах пошуку замість
 *   URL. Це робить сніпет зрозумілішим і підвищує CTR.
 * Як впливає: Замість "gearforge.blog/uk/blog/ryzen-7800x3d-vs-i7-14700k"
 *   Google показує "gearforge.blog › Блог › Ryzen 7800X3D vs i7-14700K".
 */

type BreadcrumbItem = {
  name: string;
  url: string;
};

type BreadcrumbJsonLdProps = {
  items: BreadcrumbItem[];
};

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// ─── FAQPage ─────────────────────────────────────────────────────────────────

/*
 * SEO-ПОЯСНЕННЯ: FAQPage schema (Розгорнуті FAQ-сніпети)
 *
 * Що: FAQPage — схема що описує блок питань і відповідей на сторінці.
 * Навіщо: Google може відобразити питання/відповіді прямо на першій сторінці
 *   пошуку у вигляді розгорнутого блоку. Це займає значно більше місця на
 *   екрані і привертає увагу користувача ще до переходу на сайт.
 * Як впливає: Featured snippet з FAQ підвищує CTR і робить сайт авторитетним
 *   джерелом у своїй ніші.
 *
 * Технічно: парсимо HTML статті на сервері, знаходимо всі .faq-item блоки
 * і витягуємо пари питання (h3) / відповідь (p). Все відбувається під час
 * статичної генерації (SSG) — без навантаження на runtime.
 */

type FAQItem = {
  question: string;
  answer: string;
};

type FAQJsonLdProps = {
  items: FAQItem[];
};

export function FAQJsonLd({ items }: FAQJsonLdProps) {
  if (items.length === 0) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Парсить HTML-контент статті і повертає масив FAQ-пар.
 * Шукає блоки <div class="faq-item"> з <h3> і <p> всередині.
 */
export function extractFAQItems(html: string): FAQItem[] {
  const items: FAQItem[] = [];
  const blockRegex = /<div[^>]*class="faq-item"[^>]*>([\s\S]*?)<\/div>/g;
  const questionRegex = /<h3[^>]*>([\s\S]*?)<\/h3>/;
  const answerRegex = /<p[^>]*>([\s\S]*?)<\/p>/;

  let match;
  while ((match = blockRegex.exec(html)) !== null) {
    const block = match[1];
    const qMatch = questionRegex.exec(block);
    const aMatch = answerRegex.exec(block);

    if (qMatch && aMatch) {
      items.push({
        question: qMatch[1].replace(/<[^>]+>/g, "").trim(),
        answer: aMatch[1].replace(/<[^>]+>/g, "").trim(),
      });
    }
  }

  return items;
}
