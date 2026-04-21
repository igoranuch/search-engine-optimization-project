import Link from "next/link";
import { getRelatedPosts } from "@/lib/posts";
import { getPostPath } from "@/lib/urls";

/*
 * SEO-ПОЯСНЕННЯ: Внутрішня перелінковка (internal linking)
 *
 * Що: Посилання між сторінками одного сайту.
 * Навіщо: Google використовує внутрішні посилання для двох цілей:
 *   1. Краулінг — робот переходить по посиланнях і знаходить нові сторінки.
 *   2. PageRank — "вага" сторінки передається по посиланнях. Чим більше
 *      внутрішніх посилань веде на сторінку, тим вона авторитетніша для Google.
 * Як впливає: Статті, які пов'язані одна з одною тематично, підсилюють
 *   тематичний авторитет (topical authority) всього сайту. Це важливий
 *   сигнал ранжування для конкурентних ніш.
 */

type Props = {
  locale: string;
  currentSlug: string;
  labels: {
    heading: string;
    readMore: string;
  };
};

export default function RelatedPosts({ locale, currentSlug, labels }: Props) {
  const related = getRelatedPosts(locale, currentSlug, 3);

  if (related.length === 0) return null;

  return (
    <aside className="related-posts">
      <h2 className="related-posts__heading">{labels.heading}</h2>
      <ul className="related-posts__list">
        {related.map((post) => (
          <li key={post.slug} className="related-posts__item">
            <Link href={getPostPath(locale, post)} className="related-posts__link">
              <span className="related-posts__title">{post.title}</span>
              <span className="related-posts__desc">{post.description}</span>
              <span className="related-posts__cta">{labels.readMore} →</span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
