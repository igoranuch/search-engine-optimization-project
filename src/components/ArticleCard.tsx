"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import type { PostMeta } from "@/lib/posts";

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
  const t = useTranslations("home");

  return (
    <article>
      <h2>
        <Link href={`/${locale}/blog/${post.slug}`}>{post.title}</Link>
      </h2>
      <p>{post.description}</p>
      <small>
        {post.date} · {post.readingTime}
      </small>
      <br />
      <Link href={`/${locale}/blog/${post.slug}`}>{t("readMore")} →</Link>
    </article>
  );
}
