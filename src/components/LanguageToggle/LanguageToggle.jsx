import { useLang } from "../../contexts/LanguageContext";
import "./LanguageToggle.css";

export default function LanguageToggle() {
  const { lang, toggleLang } = useLang();
  return (
    <button className="lang-toggle" onClick={toggleLang} aria-label="Trocar idioma">
      <span className={`lang-toggle__opt${lang === "pt" ? " lang-toggle__opt--active" : ""}`}>PT</span>
      <span className={`lang-toggle__opt${lang === "en" ? " lang-toggle__opt--active" : ""}`}>EN</span>
    </button>
  );
}
