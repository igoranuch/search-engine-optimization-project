/*
 * SEO-ПОЯСНЕННЯ: JSON-LD Structured Data (Структуровані дані)
 *
 * Що: JSON-LD — це формат для передачі структурованих даних пошуковим системам.
 *   Це невидимий для користувача JSON-блок у <script> тегу на сторінці.
 * Навіщо: Structured Data допомагає Google точно зрозуміти тип контенту:
 *   це стаття? рецепт? товар? відгук? На основі цього Google може показати
 *   розширений сніпет (rich snippet) — з датою, автором, зображенням.
 * Як впливає: Сторінки з rich snippets мають вищий CTR (до 30% більше кліків),
 *   бо вони візуально виділяються в результатах пошуку.
 *
 * Ми використовуємо схему "Article" з schema.org — стандартний словник
 * структурованих даних, який підтримують Google, Bing, Yahoo.
 */

type ArticleJsonLdProps = {
  title: string;
  description: string;
  date: string;
  author: string;
  url: string;
  image?: string;
};

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
    author: {
      "@type": "Person",
      name: author,
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
