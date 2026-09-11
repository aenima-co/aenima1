import { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext(null);

// Mapeamento do código de UI para o locale do Strapi (e também um valor
// válido pro atributo lang do <html> — mesmos códigos servem pros dois).
const STRAPI_LOCALE = { pt: "pt-BR", en: "en" };

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("pt");
  const toggleLang = () => setLang((l) => (l === "pt" ? "en" : "pt"));

  // Sem isso, <html lang> ficava travado no valor inicial do index.html
  // mesmo depois de trocar de idioma pela interface — atrapalha leitor de
  // tela, que usa esse atributo pra saber com que pronúncia ler o texto.
  useEffect(() => {
    document.documentElement.lang = STRAPI_LOCALE[lang];
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, locale: STRAPI_LOCALE[lang], toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
