import { createContext, useContext, useState } from "react";

const LanguageContext = createContext(null);

// Mapeamento do código de UI para o locale do Strapi
const STRAPI_LOCALE = { pt: "pt-BR", en: "en" };

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("pt");
  const toggleLang = () => setLang((l) => (l === "pt" ? "en" : "pt"));

  return (
    <LanguageContext.Provider value={{ lang, locale: STRAPI_LOCALE[lang], toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
