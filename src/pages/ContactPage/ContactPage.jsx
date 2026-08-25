import { useState, useEffect, useRef } from "react";
import { getContact, postContactSubmission } from "../../api";
import { useLang } from "../../contexts/LanguageContext";
import styles from "./ContactPage.module.css";
import { resolveMediaUrl } from "../../config";
import { t } from "../../i18n/messages";
import { usePageTitle } from "../../hooks/usePageTitle";

const ArrowIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 11L11 1M11 10V1H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 9.5L7 13.5L15 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const WarningIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M9 5.5V9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="9" cy="12.3" r="0.9" fill="currentColor" />
  </svg>
);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const BANNER_DURATION_MS = 8000;

function validateForm(formState, lang) {
  const errors = {};
  if (!formState.name.trim()) errors.name = t(lang, "contactForm.nameRequired");
  if (!formState.email.trim() || !EMAIL_RE.test(formState.email.trim())) {
    errors.email = t(lang, "contactForm.emailInvalid");
  }
  if (!formState.description.trim()) errors.description = t(lang, "contactForm.descriptionRequired");
  return errors;
}

function friendlyFieldMessage(field, lang) {
  if (field === "email") return t(lang, "contactForm.emailInvalid");
  if (field === "description") return t(lang, "contactForm.descriptionRequired");
  if (field === "name") return t(lang, "contactForm.nameRequired");
  return t(lang, "contactForm.invalidField");
}

function getBannerMessage(err, lang) {
  if (err.status === 429) return t(lang, "contactForm.rateLimitedBanner");
  if (err.status && err.status < 500) return t(lang, "contactForm.clientErrorBanner");
  return t(lang, "contactForm.serverErrorBanner");
}

const DISMISS_THRESHOLD_RATIO = 0.3;

function DismissibleBanner({ variant, icon, message, onDismiss }) {
  const [dragX, setDragX] = useState(0);
  const draggingRef = useRef(false);
  const startXRef = useRef(0);
  const widthRef = useRef(1);

  const handlePointerDown = (e) => {
    draggingRef.current = true;
    startXRef.current = e.clientX;
    widthRef.current = e.currentTarget.offsetWidth || 1;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!draggingRef.current) return;
    setDragX(e.clientX - startXRef.current);
  };

  const endDrag = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    if (Math.abs(dragX) > widthRef.current * DISMISS_THRESHOLD_RATIO) {
      onDismiss();
    } else {
      setDragX(0);
    }
  };

  const opacity = Math.max(1 - Math.abs(dragX) / widthRef.current, 0);

  return (
    <div
      className={`${styles.feedbackBanner} ${styles[variant]}`}
      role={variant === "feedbackSuccess" ? "status" : "alert"}
      style={{
        transform: `translateX(${dragX}px)`,
        opacity,
        transition: draggingRef.current ? "none" : "transform 0.2s ease, opacity 0.2s ease",
        touchAction: "pan-y",
        cursor: "grab",
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      {icon}
      <span>{message}</span>
    </div>
  );
}

// Links vindos do Strapi às vezes não têm protocolo (ex: "instagram.com"),
// o que faz o navegador tratar como caminho relativo do próprio site em
// vez de um link externo.
function normalizeUrl(url) {
  if (!url || url === "#") return "#";
  if (/^(https?:)?\/\//i.test(url) || /^(mailto|tel):/i.test(url)) return url;
  return `https://${url}`;
}

function SocialIcons({ items, className }) {
  if (!items?.length) return null;
  return (
    <div className={className}>
      {items.map((s, i) => {
        const iconUrl = resolveMediaUrl(s.icon?.url);
        return (
          <a
            key={i}
            href={normalizeUrl(s.url)}
            className={styles.socialIcon}
            target="_blank"
            rel="noreferrer"
            aria-label={s.nome || `Social ${i + 1}`}
          >
            {iconUrl && <img src={iconUrl} alt="" />}
          </a>
        );
      })}
    </div>
  );
}

export default function ContactPage() {
  const { locale, lang } = useLang();
  usePageTitle("contact", lang);
  const [page, setPage] = useState(null);
  const [formState, setFormState] = useState({ name: "", email: "", description: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [bannerMessage, setBannerMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    getContact(locale).then(setPage);
  }, [locale]);

  useEffect(() => {
    if (status !== "success" && status !== "error") return;
    const timer = setTimeout(() => {
      setStatus("idle");
      setBannerMessage("");
    }, BANNER_DURATION_MS);
    return () => clearTimeout(timer);
  }, [status]);

  const updateField = (field) => (e) => {
    const { value } = e.target;
    setFormState((s) => ({ ...s, [field]: value }));
    setFieldErrors((fe) => (fe[field] ? { ...fe, [field]: undefined } : fe));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm(formState, lang);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setStatus("idle");
      return;
    }

    setStatus("sending");
    setBannerMessage("");
    setFieldErrors({});
    try {
      await postContactSubmission(formState);
      setStatus("success");
      setFormState({ name: "", email: "", description: "" });
    } catch (err) {
      console.error("[ContactPage] erro ao enviar formulário:", err);
      setStatus("error");
      setBannerMessage(getBannerMessage(err, lang));
      const serverErrors = {};
      err.fieldErrors?.forEach((fe) => {
        const field = fe.path?.[0];
        if (field) serverErrors[field] = friendlyFieldMessage(field, lang);
      });
      setFieldErrors(serverErrors);
    }
  };

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
      <form className={styles.form} onSubmit={handleSubmit} noValidate>

        <div className={styles.field}>
          <label className={styles.label}>{form?.form_name}</label>
          <input
            type="text"
            className={`${styles.input} ${fieldErrors.name ? styles.inputError : ""}`}
            placeholder={form?.form_name}
            value={formState.name}
            onChange={updateField("name")}
            aria-invalid={Boolean(fieldErrors.name)}
          />
          {fieldErrors.name && <p className={styles.fieldError}>{fieldErrors.name}</p>}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>{form?.email_form}</label>
          <input
            type="email"
            className={`${styles.input} ${fieldErrors.email ? styles.inputError : ""}`}
            placeholder={form?.email_form}
            value={formState.email}
            onChange={updateField("email")}
            aria-invalid={Boolean(fieldErrors.email)}
          />
          {fieldErrors.email && <p className={styles.fieldError}>{fieldErrors.email}</p>}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>{form?.description_form}</label>
          <textarea
            className={`${styles.input} ${styles.textarea} ${fieldErrors.description ? styles.inputError : ""}`}
            placeholder={form?.description_placeholder}
            value={formState.description}
            onChange={updateField("description")}
            aria-invalid={Boolean(fieldErrors.description)}
          />
          {fieldErrors.description && <p className={styles.fieldError}>{fieldErrors.description}</p>}
        </div>

        <div className={styles.btnWrap}>
          <button
            type="submit"
            className={`cta-btn cta-btn--light ${styles.btn}`}
            disabled={status === "sending"}
          >
            <span className={`cta-btn__text ${styles.btnText}`}>
              {status === "sending" ? t(lang, "contactForm.sending") : ctaText}
            </span>
            <span className="cta-btn__circle">
              <ArrowIcon />
            </span>
          </button>
        </div>

        {status === "success" && (
          <DismissibleBanner
            variant="feedbackSuccess"
            icon={<CheckIcon />}
            message={t(lang, "contactForm.successBanner")}
            onDismiss={() => setStatus("idle")}
          />
        )}
        {status === "error" && (
          <DismissibleBanner
            variant="feedbackError"
            icon={<WarningIcon />}
            message={bannerMessage}
            onDismiss={() => {
              setStatus("idle");
              setBannerMessage("");
            }}
          />
        )}

      </form>

      {/* Ícones mobile */}
      <SocialIcons items={page?.social_mobile} className={styles.socialsMobile} />

      {/* Col 1 rodapé — ícones desktop + date */}
      <div className={styles.col1Foot}>
        <SocialIcons items={page?.social_desktop} className={styles.socialsDesktop} />
        {page?.date && <p className={styles.date}>{page.date}</p>}
      </div>

    </div>
  );
}
