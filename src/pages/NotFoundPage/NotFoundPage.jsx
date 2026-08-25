import { useEffect } from "react";
import { useLang } from "../../contexts/LanguageContext";
import Button from "../../components/Button/Button";
import styles from "./NotFoundPage.module.css";

const TEXT = {
  pt: {
    code: "404",
    title: "Página não encontrada",
    subtitle: "O link que você seguiu pode estar quebrado, ou a página pode ter sido removida.",
    cta: "Voltar para a home",
  },
  en: {
    code: "404",
    title: "Page not found",
    subtitle: "The link you followed may be broken, or the page may have been removed.",
    cta: "Back to home",
  },
};

export default function NotFoundPage() {
  const { lang } = useLang();
  const text = TEXT[lang] || TEXT.pt;

  useEffect(() => {
    document.title = `${text.title} — aenima`;
  }, [text.title]);

  return (
    <div className={styles.page}>
      <span className={styles.code}>{text.code}</span>
      <h1 className={styles.title}>{text.title}</h1>
      <p className={styles.subtitle}>{text.subtitle}</p>
      <Button href="/">{text.cta}</Button>
    </div>
  );
}
