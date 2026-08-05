import { useState, useEffect } from "react";
import { getContact } from "../../api";
import { useLang } from "../../contexts/LanguageContext";
import styles from "./ContactPage.module.css";

const STRAPI_URL = "http://localhost:1337";

const ArrowIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 11L11 1M11 10V1H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function SocialIcons({ items, className }) {
  if (!items?.length) return null;
  return (
    <div className={className}>
      {items.map((s, i) => {
        const iconUrl = s.icon?.url ? `${STRAPI_URL}${s.icon.url}` : null;
        return (
          <a
            key={i}
            href={s.link || "#"}
            className={styles.socialIcon}
            target="_blank"
            rel="noreferrer"
            aria-label={s.name || `Social ${i + 1}`}
          >
            {iconUrl && <img src={iconUrl} alt="" />}
          </a>
        );
      })}
    </div>
  );
}

export default function ContactPage() {
  const { locale } = useLang();
  const [page, setPage] = useState(null);
  const [formState, setFormState] = useState({ name: "", email: "", description: "" });

  useEffect(() => {
    getContact(locale).then(setPage);
  }, [locale]);

  const handleSubmit = (e) => e.preventDefault();

  // form é array de componente repetível no Strapi
  const form = Array.isArray(page?.form) ? page.form[0] : (page?.form ?? {});
  const ctaText = Array.isArray(form?.form_cta)
    ? (form.form_cta[0]?.texto || "Enviar")
    : (form?.form_cta?.texto || "Enviar");

  return (
    <div className={styles.page}>

      {/* Col 1 topo — título + subtítulo */}
      <div className={styles.col1Head}>
        {page?.title && <p className={styles.title}>{page.title}</p>}
        {page?.subtitle && <h1 className={styles.subtitle}>{page.subtitle}</h1>}
      </div>

      {/* Col 2 — Formulário (no DOM depois do col1Head para manter ordem mobile correta) */}
      <form className={styles.form} onSubmit={handleSubmit}>

        <div className={styles.field}>
          <label className={styles.label}>{form?.form_name}</label>
          <input
            type="text"
            className={styles.input}
            placeholder={form?.form_name}
            value={formState.name}
            onChange={(e) => setFormState((s) => ({ ...s, name: e.target.value }))}
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>{form?.email_form}</label>
          <input
            type="email"
            className={styles.input}
            placeholder={form?.email_form}
            value={formState.email}
            onChange={(e) => setFormState((s) => ({ ...s, email: e.target.value }))}
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>{form?.description_form}</label>
          <textarea
            className={`${styles.input} ${styles.textarea}`}
            placeholder="Conte-nos um pouco mais do que busca :)"
            value={formState.description}
            onChange={(e) => setFormState((s) => ({ ...s, description: e.target.value }))}
            required
          />
        </div>

        <div className={styles.btnWrap}>
          <button type="submit" className={`cta-btn cta-btn--light ${styles.btn}`}>
            <span className={`cta-btn__text ${styles.btnText}`}>{ctaText}</span>
            <span className="cta-btn__circle">
              <ArrowIcon />
            </span>
          </button>
        </div>

      </form>

      {/* Ícones mobile — aparece entre form e date no mobile */}
      <SocialIcons items={page?.social_mobile} className={styles.socialsMobile} />

      {/* Col 1 rodapé — ícones desktop + date */}
      <div className={styles.col1Foot}>
        <SocialIcons items={page?.social_desktop} className={styles.socialsDesktop} />
        {page?.date && <p className={styles.date}>{page.date}</p>}
      </div>

    </div>
  );
}
