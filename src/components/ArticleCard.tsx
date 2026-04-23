"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import type { PostMeta } from "@/lib/posts";
import { getPostPath } from "@/lib/urls";

/*
 * SEO-ПОЯСНЕННЯ: Семантичний HTML — <article>
 *
 * Що: <article> — семантичний тег для самостійного контенту (стаття, пост).
 * Навіщо: Google розпізнає <article> як окремий блок контенту.
 *   Це допомагає правильно визначити основний зміст сторінки.
 * Як впливає: Покращує розуміння структури сторінки пошуковим роботом.
 */

type Props = {
  post: PostMeta;
  locale: string;
};

export default function ArticleCard({ post, locale }: Props) {
  const { t } = useTranslation();

  return (
    <article className="article-card">
      <h2>
        <Link href={getPostPath(locale, post)}>{post.title}</Link>
      </h2>
      <p>{post.description}</p>
      {/*
       * SEO-ПОЯСНЕННЯ: Час читання (Reading Time)
       * Відображення "5 min read" поруч з датою підвищує CTR у пошуку
       * та покращує dwell time — користувачі, які знають обсяг, рідше
       * одразу повертаються назад (low bounce rate = позитивний UX-сигнал).
       */}
      <div className="article-card-meta">
        <small>{post.date}</small>
        <span className="reading-time">
          {t("article.readingTime", { count: post.readingTime })}
        </span>
      </div>
      <Link href={getPostPath(locale, post)} className="read-more">
        {t("home.readMore")} →
      </Link>
    </article>
  );
}
