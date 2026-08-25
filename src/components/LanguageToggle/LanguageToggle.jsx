import { useLang } from "../../contexts/LanguageContext";
import { t } from "../../i18n/messages";
import "./LanguageToggle.css";

export default function LanguageToggle() {
  const { lang, toggleLang } = useLang();
  return (
    <button className="lang-toggle" onClick={toggleLang} aria-label={t(lang, "languageToggle.switchLanguage")}>
      <span className={`lang-toggle__opt${lang === "pt" ? " lang-toggle__opt--active" : ""}`}>PT</span>
      <span className={`lang-toggle__opt${lang === "en" ? " lang-toggle__opt--active" : ""}`}>EN</span>
    </button>
  );
}
