import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "../locales/en.json";
import bn from "../locales/bn.json";

const LANG_KEY = "bdapps_lang";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      bn: { translation: bn },
    },
    fallbackLng: "en",
    supportedLngs: ["en", "bn"],
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator"],
      lookupLocalStorage: LANG_KEY,
      caches: ["localStorage"],
    },
    react: { useSuspense: false },
  });

// Force Bangla default when browser is Bengali (already covered by detector navigator step)
// but explicitly set on first load if no stored value AND navigator includes bn
if (typeof window !== "undefined") {
  const stored = localStorage.getItem(LANG_KEY);
  if (!stored) {
    const navLang = (navigator.language || "").toLowerCase();
    if (navLang.startsWith("bn") || navLang.startsWith("bd")) {
      i18n.changeLanguage("bn");
    }
  }
  // Keep html lang attribute synced
  const syncHtmlLang = (lng) => {
    document.documentElement.setAttribute("lang", lng);
    document.documentElement.setAttribute("dir", "ltr");
  };
  syncHtmlLang(i18n.language || "en");
  i18n.on("languageChanged", syncHtmlLang);
}

export const setLanguage = (lng) => i18n.changeLanguage(lng);
export const getLanguage = () => i18n.language || "en";

export default i18n;
