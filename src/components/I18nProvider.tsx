"use client";

import { useMemo } from "react";
import i18next from "i18next";
import { I18nextProvider, initReactI18next } from "react-i18next";
import en from "@/i18n/messages/en.json";
import uk from "@/i18n/messages/uk.json";

const resources = {
  en: { translation: en },
  uk: { translation: uk },
};

type Props = {
  locale: string;
  children: React.ReactNode;
};

/**
 * Створює окремий i18next instance для кожної локалі (через useMemo).
 *
 * Чому НЕ singleton + changeLanguage:
 * changeLanguage() тригерить event, на який підписані useTranslation-хуки.
 * Якщо виклик відбувається під час рендеру — React кидає помилку
 * "Cannot update a component while rendering a different component".
 *
 * Рішення: initImmediate: false + createInstance на кожну зміну locale
 * гарантує синхронну ініціалізацію без зайвих state-апдейтів.
 */
export default function I18nProvider({ locale, children }: Props) {
  const i18n = useMemo(() => {
    const instance = i18next.createInstance();
    // initImmediate: false — синхронна ініціалізація,
    // бо ресурси вже передані напряму (не через backend)
    instance.use(initReactI18next).init({
      lng: locale,
      resources,
      interpolation: { escapeValue: false },
    });
    return instance;
  }, [locale]);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
