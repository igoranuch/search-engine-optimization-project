/**
 * Серверна ініціалізація i18next.
 *
 * Використовується в Server Components (layout, page).
 * Кожен виклик створює окремий i18next instance щоб уникнути
 * конфліктів між паралельними запитами на сервері.
 */
import i18next from "i18next";
import en from "./messages/en.json";
import uk from "./messages/uk.json";

const resources = {
  en: { translation: en },
  uk: { translation: uk },
};

export async function getTranslation(locale: string) {
  const i18n = i18next.createInstance();
  await i18n.init({
    lng: locale,
    resources,
    interpolation: { escapeValue: false },
  });
  return { t: i18n.t.bind(i18n) };
}
