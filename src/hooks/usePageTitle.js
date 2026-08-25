import { useEffect } from "react";

const SITE_NAME = "aenima";

// Título específico de cada rota, nos dois idiomas. Pra adicionar uma
// página nova, adicione a chave aqui e chame usePageTitle("chave") no
// componente da página.
const TITLES = {
  pt: {
    home: "aenima — UI, UX & Web Design",
    about: "Sobre",
    work: "Portfólio",
    blog: "Blog",
    contact: "Contato",
  },
  en: {
    home: "aenima — UI, UX & Web Design",
    about: "About",
    work: "Portfolio",
    blog: "Blog",
    contact: "Contact",
  },
};

export function usePageTitle(key, lang, overrideTitle) {
  useEffect(() => {
    if (overrideTitle) {
      document.title = `${overrideTitle} — ${SITE_NAME}`;
      return;
    }
    const dict = TITLES[lang] || TITLES.pt;
    document.title = dict[key] || dict.home;
  }, [key, lang, overrideTitle]);
}
