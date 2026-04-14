/**
 * Клієнтська ініціалізація i18next.
 *
 * Singleton instance для Client Components.
 * Використовується разом з react-i18next (useTranslation хук).
 */
import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./messages/en.json";
import uk from "./messages/uk.json";

i18next.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    uk: { translation: uk },
  },
  lng: "uk",
  fallbackLng: "uk",
  interpolation: { escapeValue: false },
});

export default i18next;
