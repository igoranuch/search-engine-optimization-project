import { NextRequest, NextResponse } from "next/server";

const locales = ["uk", "en"];
const defaultLocale = "en";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Перевіряємо чи є локаль на початку шляху
  const pathnameLocale = locales.find(
    (locale) =>
      pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  const locale = pathnameLocale || defaultLocale;

  // Передаємо локаль у заголовку для root layout (щоб встановити lang на <html>)
  const response = pathnameLocale
    ? NextResponse.next()
    : NextResponse.redirect(new URL(`/${defaultLocale}${pathname}`, request.url), 308);

  response.headers.set("x-locale", locale);
  return response;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
