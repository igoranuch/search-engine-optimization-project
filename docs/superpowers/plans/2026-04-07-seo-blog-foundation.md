# SEO Blog Foundation — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create the foundation of a bilingual (UA/EN) SEO-optimized blog about computers, hardware, and games using Next.js + React + TypeScript.

**Architecture:** Next.js App Router with file-based routing and `[locale]` dynamic segment for i18n. Blog posts stored as MDX files in `/content/` directory. SEO metadata generated per-page with reusable utilities. `next-intl` handles translations, `next-mdx-remote` renders MDX content.

**Tech Stack:** Next.js 15, React 19, TypeScript, next-intl, next-mdx-remote, CSS Modules

---

## File Structure

```
src/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx        — Root layout: semantic HTML shell, <html lang>, навігація
│   │   ├── page.tsx          — Homepage: список останніх статей
│   │   └── blog/
│   │       └── [slug]/
│   │           └── page.tsx  — Blog post page: стаття + JSON-LD
│   ├── layout.tsx            — Root layout (fonts, base metadata)
│   └── not-found.tsx         — 404 page
├── components/
│   ├── Header.tsx            — Навігація + перемикач мов
│   ├── Footer.tsx            — Футер з посиланнями
│   ├── ArticleCard.tsx       — Картка статті для списку
│   ├── LanguageSwitcher.tsx  — Перемикач UA/EN
│   └── seo/
│       └── JsonLd.tsx        — JSON-LD structured data component
├── lib/
│   ├── posts.ts              — Функції для читання MDX-файлів
│   └── seo.ts                — Утиліти для генерації metadata
└── i18n/
    ├── request.ts            — next-intl server config
    ├── routing.ts            — Locale routing config
    └── messages/
        ├── uk.json           — Українські переклади UI
        └── en.json           — Англійські переклади UI

content/
├── uk/
│   └── oglyad-rtx-4070.mdx  — Приклад статті українською
└── en/
    └── rtx-4070-review.mdx   — Приклад статті англійською

middleware.ts                  — Redirect / до /uk/ (default locale)
next.config.ts                 — Next.js + MDX конфігурація
```

---

## Task 1: Ініціалізація Next.js проєкту

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `src/app/layout.tsx`, `src/app/[locale]/page.tsx`

- [ ] **Step 1: Створити Next.js проєкт**

```bash
cd "/c/Users/igorm/OneDrive/Desktop/project 0/search-engine-optimization-project"
npx create-next-app@latest . --typescript --tailwind=no --eslint --app --src-dir --import-alias="@/*" --use-npm
```

Expected: Next.js проєкт створено зі стандартною структурою App Router.

- [ ] **Step 2: Очистити шаблонний код**

Видалити шаблонний вміст з `src/app/page.tsx` та `src/app/globals.css`. Замінити на мінімальний контент.

`src/app/page.tsx`:
```tsx
export default function Home() {
  return (
    <main>
      <h1>TechPulse Blog</h1>
      <p>Блог про комп'ютери, комплектуючі та ігри</p>
    </main>
  );
}
```

`src/app/globals.css` — залишити лише базові стилі (reset), видалити все шаблонне від Next.js.

- [ ] **Step 3: Перевірити що dev-сервер запускається**

```bash
npm run dev
```

Expected: Сервер стартує на `http://localhost:3000`, сторінка відображає "TechPulse Blog".

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "feat: initialize Next.js project with TypeScript and App Router"
```

---

## Task 2: Налаштування i18n (next-intl)

**Files:**
- Create: `src/i18n/routing.ts`, `src/i18n/request.ts`, `src/i18n/messages/uk.json`, `src/i18n/messages/en.json`, `middleware.ts`
- Modify: `src/app/layout.tsx`, `next.config.ts`
- Create: `src/app/[locale]/layout.tsx`, `src/app/[locale]/page.tsx`

- [ ] **Step 1: Встановити next-intl**

```bash
npm install next-intl
```

- [ ] **Step 2: Створити конфігурацію маршрутизації**

`src/i18n/routing.ts`:
```ts
import { defineRouting } from "next-intl/routing";

/*
 * SEO-ПОЯСНЕННЯ: Мовні префікси в URL (/uk/, /en/)
 * 
 * Що: Кожна мовна версія сторінки має свій унікальний URL.
 * Навіщо: Google індексує кожну мовну версію окремо. Це дозволяє
 *   українській версії з'являтись в google.com.ua, а англійській — в google.com.
 * Як впливає: Без окремих URL Google не зможе розрізнити мовні версії,
 *   і може показувати користувачам сторінку не тією мовою.
 */
export const routing = defineRouting({
  locales: ["uk", "en"],
  defaultLocale: "uk",
});
```

- [ ] **Step 3: Створити серверну конфігурацію i18n**

`src/i18n/request.ts`:
```ts
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
```

- [ ] **Step 4: Створити файли перекладів**

`src/i18n/messages/uk.json`:
```json
{
  "site": {
    "title": "TechPulse — Блог про комп'ютери та ігри",
    "description": "Огляди комплектуючих, порівняння продуктивності та новини ігор"
  },
  "nav": {
    "home": "Головна",
    "blog": "Блог",
    "about": "Про нас"
  },
  "home": {
    "heading": "Останні статті",
    "readMore": "Читати далі"
  },
  "blog": {
    "publishedAt": "Опубліковано",
    "author": "Автор"
  }
}
```

`src/i18n/messages/en.json`:
```json
{
  "site": {
    "title": "TechPulse — Computer & Gaming Blog",
    "description": "Hardware reviews, performance benchmarks and gaming news"
  },
  "nav": {
    "home": "Home",
    "blog": "Blog",
    "about": "About"
  },
  "home": {
    "heading": "Latest Articles",
    "readMore": "Read more"
  },
  "blog": {
    "publishedAt": "Published",
    "author": "Author"
  }
}
```

- [ ] **Step 5: Створити middleware для перенаправлення**

`middleware.ts`:
```ts
import createMiddleware from "next-intl/middleware";
import { routing } from "./src/i18n/routing";

/*
 * SEO-ПОЯСНЕННЯ: Middleware для мовного перенаправлення
 * 
 * Що: Автоматично перенаправляє / → /uk/ (або /en/ для англомовних).
 * Навіщо: Кожна сторінка повинна мати чітку мовну версію в URL.
 *   Це запобігає дублюванню контенту (duplicate content) — одна з
 *   найпоширеніших SEO-проблем для багатомовних сайтів.
 * Як впливає: Google "штрафує" сайти за дубльований контент,
 *   знижуючи їх позиції в пошуку.
 */
export default createMiddleware(routing);

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
```

- [ ] **Step 6: Оновити next.config.ts**

`next.config.ts`:
```ts
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {};

export default withNextIntl(nextConfig);
```

- [ ] **Step 7: Створити locale layout**

`src/app/[locale]/layout.tsx`:
```tsx
import { NextIntlClientProvider, useMessages } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

/*
 * SEO-ПОЯСНЕННЯ: Атрибут lang на <html>
 * 
 * Що: <html lang="uk"> або <html lang="en"> — вказує мову сторінки.
 * Навіщо: Пошукові системи та screen readers використовують цей атрибут
 *   щоб правильно визначити мову контенту.
 * Як впливає: Допомагає Google показувати сторінку правильній аудиторії.
 *   Також покращує доступність (accessibility).
 */

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 8: Оновити locale page**

`src/app/[locale]/page.tsx`:
```tsx
import { useTranslations } from "next-intl";

export default function HomePage() {
  const t = useTranslations("home");

  return (
    <main>
      <h1>{t("heading")}</h1>
    </main>
  );
}
```

- [ ] **Step 9: Оновити кореневий layout**

`src/app/layout.tsx` — видалити `<html>` і `<body>` теги (вони тепер у locale layout):
```tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
```

- [ ] **Step 10: Перевірити i18n працює**

```bash
npm run dev
```

Expected:
- `http://localhost:3000` → перенаправляє на `/uk`
- `http://localhost:3000/uk` → "Останні статті"
- `http://localhost:3000/en` → "Latest Articles"

- [ ] **Step 11: Commit**

```bash
git add .
git commit -m "feat: add i18n support with next-intl (uk/en)"
```

---

## Task 3: Семантичний HTML layout + навігація

**Files:**
- Create: `src/components/Header.tsx`, `src/components/Footer.tsx`, `src/components/LanguageSwitcher.tsx`
- Modify: `src/app/[locale]/layout.tsx`
- Create: `src/app/globals.css`

- [ ] **Step 1: Створити компонент Header**

`src/components/Header.tsx`:
```tsx
import Link from "next/link";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "./LanguageSwitcher";

/*
 * SEO-ПОЯСНЕННЯ: Семантичний HTML — <header> та <nav>
 *
 * Що: <header> — семантичний тег для шапки сайту.
 *   <nav> — семантичний тег для навігації.
 * Навіщо: Google використовує семантичні теги щоб зрозуміти структуру сторінки.
 *   <nav> допомагає пошуковому роботу знайти основні розділи сайту.
 * Як впливає: Правильна семантика покращує розуміння сайту пошуковими
 *   системами та допомагає формувати sitelinks (швидкі посилання) в результатах пошуку.
 */

export default function Header({ locale }: { locale: string }) {
  const t = useTranslations("nav");

  return (
    <header>
      <nav aria-label="Main navigation">
        <Link href={`/${locale}`}>
          <strong>TechPulse</strong>
        </Link>
        <ul>
          <li><Link href={`/${locale}`}>{t("home")}</Link></li>
          <li><Link href={`/${locale}/blog`}>{t("blog")}</Link></li>
        </ul>
        <LanguageSwitcher locale={locale} />
      </nav>
    </header>
  );
}
```

- [ ] **Step 2: Створити компонент LanguageSwitcher**

`src/components/LanguageSwitcher.tsx`:
```tsx
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

/*
 * SEO-ПОЯСНЕННЯ: Перемикач мов та hreflang
 *
 * Що: Перемикач мов дозволяє користувачу змінити мову сторінки.
 * Навіщо: Google рекомендує надавати чіткі посилання між мовними версіями.
 *   Це допомагає пошуковому роботу знайти всі мовні версії сторінки.
 * Як впливає: Покращує user experience та допомагає Google
 *   правильно індексувати мовні версії.
 */

export default function LanguageSwitcher({ locale }: { locale: string }) {
  const pathname = usePathname();
  const otherLocale = locale === "uk" ? "en" : "uk";

  // Замінюємо поточну мову в URL на іншу: /uk/blog → /en/blog
  const switchedPath = pathname.replace(`/${locale}`, `/${otherLocale}`);

  return (
    <Link href={switchedPath}>
      {otherLocale === "uk" ? "🇺🇦 UA" : "🇬🇧 EN"}
    </Link>
  );
}
```

- [ ] **Step 3: Створити компонент Footer**

`src/components/Footer.tsx`:
```tsx
/*
 * SEO-ПОЯСНЕННЯ: Семантичний HTML — <footer>
 *
 * Що: <footer> — семантичний тег для підвалу сайту.
 * Навіщо: Допомагає пошуковим системам відрізнити основний контент від
 *   допоміжної інформації (копірайт, посилання на політику тощо).
 */

export default function Footer() {
  return (
    <footer>
      <p>© {new Date().getFullYear()} TechPulse. All rights reserved.</p>
    </footer>
  );
}
```

- [ ] **Step 4: Інтегрувати в layout**

Оновити `src/app/[locale]/layout.tsx` — додати Header і Footer:
```tsx
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Header locale={locale} />
          <main>{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 5: Додати базові стилі**

`src/app/globals.css`:
```css
/* Базовий CSS reset та стилі для блогу */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  line-height: 1.6;
  color: #1a1a1a;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

header nav {
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 1rem 0;
  border-bottom: 1px solid #e5e5e5;
}

header nav ul {
  display: flex;
  list-style: none;
  gap: 1.5rem;
}

header nav a {
  text-decoration: none;
  color: #1a1a1a;
}

header nav a:hover {
  color: #0066cc;
}

main {
  min-height: 60vh;
  padding: 2rem 0;
}

footer {
  padding: 2rem 0;
  border-top: 1px solid #e5e5e5;
  text-align: center;
  color: #666;
}
```

- [ ] **Step 6: Підключити globals.css в кореневий layout**

`src/app/layout.tsx`:
```tsx
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
```

- [ ] **Step 7: Перевірити layout працює**

```bash
npm run dev
```

Expected: Header з навігацією, перемикач мов, Footer відображаються на всіх сторінках. Перемикач мов працює: `/uk` ↔ `/en`.

- [ ] **Step 8: Commit**

```bash
git add .
git commit -m "feat: add semantic HTML layout with Header, Footer, LanguageSwitcher"
```

---

## Task 4: SEO metadata та hreflang

**Files:**
- Create: `src/lib/seo.ts`
- Modify: `src/app/[locale]/layout.tsx`, `src/app/[locale]/page.tsx`

- [ ] **Step 1: Створити SEO-утиліти**

`src/lib/seo.ts`:
```ts
import type { Metadata } from "next";

/*
 * SEO-ПОЯСНЕННЯ: Metadata API в Next.js
 *
 * Що: Next.js має вбудований Metadata API для генерації <title>, <meta>,
 *   Open Graph тегів та інших SEO-елементів.
 * Навіщо: Мета-теги — це перше, що бачить Google при індексації сторінки.
 *   <title> та <meta description> відображаються прямо в результатах пошуку.
 * Як впливає: Якісний title та description підвищують CTR (click-through rate) —
 *   відсоток користувачів, які клікають на твій результат в пошуку.
 *
 * Open Graph теги потрібні для коректного відображення при поширенні
 * посилання в соціальних мережах (Facebook, Twitter, Telegram тощо).
 */

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

type SeoParams = {
  title: string;
  description: string;
  locale: string;
  path: string;
  image?: string;
};

export function generatePageMetadata({
  title,
  description,
  locale,
  path,
  image,
}: SeoParams): Metadata {
  const url = `${BASE_URL}/${locale}${path}`;
  const otherLocale = locale === "uk" ? "en" : "uk";
  const alternateUrl = `${BASE_URL}/${otherLocale}${path}`;

  return {
    title,
    description,

    /*
     * SEO-ПОЯСНЕННЯ: hreflang (alternates)
     *
     * Що: Тег <link rel="alternate" hreflang="uk" href="..."> вказує Google,
     *   що існує версія цієї сторінки іншою мовою.
     * Навіщо: Без hreflang Google може вважати українську та англійську версії
     *   дублікатами і показувати лише одну. З hreflang — кожна мовна версія
     *   з'являється для відповідної аудиторії.
     * Як впливає: Українські користувачі бачать UA-версію, англійські — EN-версію.
     */
    alternates: {
      canonical: url,
      languages: {
        uk: `${BASE_URL}/uk${path}`,
        en: `${BASE_URL}/en${path}`,
      },
    },

    openGraph: {
      title,
      description,
      url,
      siteName: "TechPulse",
      locale: locale === "uk" ? "uk_UA" : "en_US",
      type: "website",
      ...(image && { images: [{ url: image, width: 1200, height: 630 }] }),
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
```

- [ ] **Step 2: Додати metadata до layout**

Оновити `src/app/[locale]/layout.tsx` — додати `generateMetadata`:
```ts
import { generatePageMetadata } from "@/lib/seo";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "site" });

  return generatePageMetadata({
    title: t("title"),
    description: t("description"),
    locale,
    path: "",
  });
}
```

- [ ] **Step 3: Додати metadata до homepage**

Оновити `src/app/[locale]/page.tsx`:
```tsx
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { generatePageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "site" });

  return generatePageMetadata({
    title: t("title"),
    description: t("description"),
    locale,
    path: "",
  });
}

export default function HomePage() {
  const t = useTranslations("home");

  return (
    <section>
      <h1>{t("heading")}</h1>
      <p>Coming soon...</p>
    </section>
  );
}
```

- [ ] **Step 4: Перевірити мета-теги**

```bash
npm run dev
```

Відкрити `http://localhost:3000/uk`, переглянути HTML-код сторінки (View Source). Expected: `<title>`, `<meta name="description">`, Open Graph теги, hreflang alternate links.

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat: add SEO metadata with hreflang, Open Graph and Twitter Cards"
```

---

## Task 5: Система блог-постів (MDX)

**Files:**
- Create: `src/lib/posts.ts`, `content/uk/oglyad-rtx-4070.mdx`, `content/en/rtx-4070-review.mdx`
- Create: `src/app/[locale]/blog/page.tsx`, `src/app/[locale]/blog/[slug]/page.tsx`
- Create: `src/components/ArticleCard.tsx`

- [ ] **Step 1: Встановити залежності для MDX**

```bash
npm install next-mdx-remote gray-matter reading-time
```

- `next-mdx-remote` — рендерить MDX-контент на сервері
- `gray-matter` — парсить frontmatter (метадані) з MDX-файлів
- `reading-time` — рахує час читання статті

- [ ] **Step 2: Створити утиліти для роботи з постами**

`src/lib/posts.ts`:
```ts
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

/*
 * Типи для метаданих статті.
 * Frontmatter — це YAML-блок на початку MDX-файлу з метаданими:
 * title, description, date, author тощо.
 */

export type PostFrontmatter = {
  title: string;
  description: string;
  date: string;
  author: string;
  tags: string[];
  image?: string;
};

export type PostMeta = PostFrontmatter & {
  slug: string;
  readingTime: string;
};

export type Post = PostMeta & {
  content: string;
};

const CONTENT_DIR = path.join(process.cwd(), "content");

/**
 * Отримати всі пости для конкретної мови, відсортовані за датою (новіші першими).
 */
export function getAllPosts(locale: string): PostMeta[] {
  const dir = path.join(CONTENT_DIR, locale);

  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));

  return files
    .map((filename) => {
      const slug = filename.replace(/\.mdx$/, "");
      const filePath = path.join(dir, filename);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(fileContent);

      return {
        slug,
        readingTime: readingTime(content).text,
        ...(data as PostFrontmatter),
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Отримати конкретний пост за slug та мовою.
 */
export function getPostBySlug(locale: string, slug: string): Post | null {
  const filePath = path.join(CONTENT_DIR, locale, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) return null;

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  return {
    slug,
    content,
    readingTime: readingTime(content).text,
    ...(data as PostFrontmatter),
  };
}

/**
 * Отримати всі slug для генерації статичних шляхів.
 */
export function getAllPostSlugs(locale: string): string[] {
  const dir = path.join(CONTENT_DIR, locale);

  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}
```

- [ ] **Step 3: Створити приклад статті українською**

`content/uk/oglyad-rtx-4070.mdx`:
```mdx
---
title: "Огляд NVIDIA RTX 4070 — чи варта вона своїх грошей у 2026?"
description: "Детальний огляд відеокарти NVIDIA GeForce RTX 4070: продуктивність у іграх, енергоефективність, порівняння з конкурентами."
date: "2026-04-07"
author: "TechPulse"
tags: ["GPU", "NVIDIA", "RTX 4070", "огляд"]
image: "/images/rtx-4070-review.jpg"
---

## Вступ

NVIDIA GeForce RTX 4070 — одна з найпопулярніших відеокарт середнього сегменту. Побудована на архітектурі Ada Lovelace, вона пропонує відмінну продуктивність для гри в 1440p.

## Характеристики

| Параметр | Значення |
|----------|----------|
| GPU | AD104 |
| CUDA ядра | 5888 |
| Пам'ять | 12 GB GDDR6X |
| TDP | 200W |
| Рекомендована ціна | $599 |

## Продуктивність у іграх

### DayZ

DayZ на максимальних налаштуваннях у 1440p видає стабільні **80-100 FPS**. Гра добре оптимізована під архітектуру Ada Lovelace, і навіть у містах з великою кількістю об'єктів fps не падає нижче 70.

### ARC Raiders

ARC Raiders на High налаштуваннях у 1440p показує **90-110 FPS**. DLSS 3 з Frame Generation дозволяє досягти понад 140 FPS без помітної втрати якості.

## Висновок

RTX 4070 залишається відмінним вибором для гри у 1440p. Якщо ви шукаєте карту з хорошим балансом ціни та продуктивності — це один з найкращих варіантів у 2026 році.
```

- [ ] **Step 4: Створити приклад статті англійською**

`content/en/rtx-4070-review.mdx`:
```mdx
---
title: "NVIDIA RTX 4070 Review — Is It Worth It in 2026?"
description: "In-depth review of the NVIDIA GeForce RTX 4070: gaming performance, power efficiency, and comparison with competitors."
date: "2026-04-07"
author: "TechPulse"
tags: ["GPU", "NVIDIA", "RTX 4070", "review"]
image: "/images/rtx-4070-review.jpg"
---

## Introduction

The NVIDIA GeForce RTX 4070 is one of the most popular mid-range graphics cards. Built on the Ada Lovelace architecture, it offers excellent performance for 1440p gaming.

## Specifications

| Parameter | Value |
|-----------|-------|
| GPU | AD104 |
| CUDA Cores | 5888 |
| Memory | 12 GB GDDR6X |
| TDP | 200W |
| MSRP | $599 |

## Gaming Performance

### DayZ

DayZ at maximum settings in 1440p delivers a stable **80-100 FPS**. The game is well optimized for the Ada Lovelace architecture, and even in cities with many objects, the fps doesn't drop below 70.

### ARC Raiders

ARC Raiders on High settings at 1440p shows **90-110 FPS**. DLSS 3 with Frame Generation pushes it beyond 140 FPS without noticeable quality loss.

## Conclusion

The RTX 4070 remains an excellent choice for 1440p gaming. If you're looking for a card with a great balance of price and performance — this is one of the best options in 2026.
```

- [ ] **Step 5: Створити компонент ArticleCard**

`src/components/ArticleCard.tsx`:
```tsx
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
```

- [ ] **Step 6: Створити сторінку списку блогу**

`src/app/[locale]/blog/page.tsx`:
```tsx
import { getAllPosts } from "@/lib/posts";
import { getTranslations } from "next-intl/server";
import { generatePageMetadata } from "@/lib/seo";
import ArticleCard from "@/components/ArticleCard";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });

  return generatePageMetadata({
    title: `${t("blog")} — TechPulse`,
    description: locale === "uk"
      ? "Усі статті про комп'ютери, комплектуючі та ігри"
      : "All articles about computers, hardware and games",
    locale,
    path: "/blog",
  });
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  const posts = getAllPosts(locale);
  const t = await getTranslations({ locale, namespace: "nav" });

  return (
    <section>
      <h1>{t("blog")}</h1>
      {posts.length === 0 && <p>No posts yet.</p>}
      {posts.map((post) => (
        <ArticleCard key={post.slug} post={post} locale={locale} />
      ))}
    </section>
  );
}
```

- [ ] **Step 7: Створити сторінку окремої статті з JSON-LD**

`src/components/seo/JsonLd.tsx`:
```tsx
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
```

`src/app/[locale]/blog/[slug]/page.tsx`:
```tsx
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getPostBySlug, getAllPostSlugs } from "@/lib/posts";
import { generatePageMetadata } from "@/lib/seo";
import { getTranslations } from "next-intl/server";
import ArticleJsonLd from "@/components/seo/JsonLd";
import type { Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getPostBySlug(locale, slug);

  if (!post) return {};

  return generatePageMetadata({
    title: `${post.title} — TechPulse`,
    description: post.description,
    locale,
    path: `/blog/${slug}`,
    image: post.image,
  });
}

/*
 * SEO-ПОЯСНЕННЯ: generateStaticParams
 *
 * Що: Ця функція вказує Next.js які сторінки згенерувати статично при збірці.
 * Навіщо: Статично згенеровані сторінки (SSG) завантажуються миттєво,
 *   бо HTML вже готовий — сервер не витрачає час на рендеринг.
 * Як впливає: Google враховує швидкість завантаження (Core Web Vitals)
 *   як фактор ранжування. SSG-сторінки отримують найкращі показники.
 */
export async function generateStaticParams() {
  const locales = ["uk", "en"];
  const params: { locale: string; slug: string }[] = [];

  for (const locale of locales) {
    const slugs = getAllPostSlugs(locale);
    for (const slug of slugs) {
      params.push({ locale, slug });
    }
  }

  return params;
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  const post = getPostBySlug(locale, slug);
  const t = await getTranslations({ locale, namespace: "blog" });

  if (!post) notFound();

  return (
    <>
      <ArticleJsonLd
        title={post.title}
        description={post.description}
        date={post.date}
        author={post.author}
        url={`${BASE_URL}/${locale}/blog/${slug}`}
        image={post.image}
      />

      {/*
       * SEO-ПОЯСНЕННЯ: Семантичний HTML — <article> та заголовки
       *
       * <article> обгортає основний контент статті.
       * <h1> — один на сторінку, це головний заголовок.
       * Google використовує <h1> для розуміння теми сторінки.
       */}
      <article>
        <header>
          <h1>{post.title}</h1>
          <p>
            {t("author")}: {post.author} · {t("publishedAt")}: {post.date} · {post.readingTime}
          </p>
          {post.tags && (
            <ul style={{ display: "flex", gap: "0.5rem", listStyle: "none" }}>
              {post.tags.map((tag) => (
                <li key={tag}>#{tag}</li>
              ))}
            </ul>
          )}
        </header>

        <MDXRemote source={post.content} />
      </article>
    </>
  );
}
```

- [ ] **Step 8: Оновити homepage — показати останні статті**

`src/app/[locale]/page.tsx`:
```tsx
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { generatePageMetadata } from "@/lib/seo";
import { getAllPosts } from "@/lib/posts";
import ArticleCard from "@/components/ArticleCard";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "site" });

  return generatePageMetadata({
    title: t("title"),
    description: t("description"),
    locale,
    path: "",
  });
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  const posts = getAllPosts(locale);

  return (
    <section>
      <h1>{t("heading")}</h1>
      {posts.length === 0 && <p>Coming soon...</p>}
      {posts.map((post) => (
        <ArticleCard key={post.slug} post={post} locale={locale} />
      ))}
    </section>
  );
}
```

- [ ] **Step 9: Перевірити блог працює**

```bash
npm run dev
```

Expected:
- `/uk` — показує картку статті "Огляд NVIDIA RTX 4070"
- `/en` — показує картку "NVIDIA RTX 4070 Review"
- `/uk/blog/oglyad-rtx-4070` — повна стаття українською з JSON-LD у HTML
- `/en/blog/rtx-4070-review` — повна стаття англійською

- [ ] **Step 10: Commit**

```bash
git add .
git commit -m "feat: add MDX blog system with sample articles and JSON-LD structured data"
```

---

## Task 6: Фінальна перевірка та build

**Files:** None (verification only)

- [ ] **Step 1: Запустити production build**

```bash
npm run build
```

Expected: Build проходить без помилок. Сторінки згенеровані статично.

- [ ] **Step 2: Перевірити production-сервер**

```bash
npm run start
```

Expected: Сайт працює на `http://localhost:3000` з усіма сторінками.

- [ ] **Step 3: Перевірити SEO-елементи в HTML**

View Source на `/uk/blog/oglyad-rtx-4070` — повинні бути:
- `<html lang="uk">`
- `<title>Огляд NVIDIA RTX 4070 — TechPulse</title>`
- `<meta name="description" content="...">`
- `<link rel="alternate" hreflang="en" href="...">`
- `<script type="application/ld+json">` з Article schema
- Open Graph мета-теги (`og:title`, `og:description`, `og:locale`)
- Семантичні теги: `<header>`, `<nav>`, `<main>`, `<article>`, `<footer>`

- [ ] **Step 4: Commit фінальний**

```bash
git add .
git commit -m "chore: verify production build and SEO output"
```
