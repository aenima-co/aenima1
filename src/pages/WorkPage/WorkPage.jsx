import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getWorks, getWorkPage } from "../../api";
import { useLang } from "../../contexts/LanguageContext";
import Button from "../../components/Button/Button";
import styles from "./WorkPage.module.css";
import { resolveMediaUrl } from "../../config";

// ─── Card individual ──────────────────────────────────────────────────────────
function WorkCard({ work, index }) {
  const firstCover = Array.isArray(work.cover) ? work.cover[0] : work.cover;
  const imageUrl = firstCover?.url
    ? resolveMediaUrl(firstCover.url)
    : resolveMediaUrl(firstCover?.formats?.large?.url);

  const placeholders = [
    "#e8e4dc",
    "#ddd8ce",
    "#e0dbd0",
    "#d8d4ca",
    "#e4e0d8",
    "#dcd8d0",
    "#e2ddd5",
    "#d6d2c8",
    "#dedad2",
  ];
  const bgColor = placeholders[index % placeholders.length];

  return (
    <article className={styles.card} style={{ "--card-index": index }}>
      <Link to={`/work/${work.slug || work.id}`} className={styles.cardLink}>
        <div className={styles.cardImageWrap}>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={work.title}
              className={styles.cardImg}
              loading="lazy"
            />
          ) : (
            <div
              className={styles.cardPlaceholder}
              style={{ background: bgColor }}
            />
          )}
        </div>

        <div className={styles.cardInfo}>
          <h3 className={styles.cardTitle}>{work.title}</h3>
          {work.client && <p className={styles.cardClient}>{work.client}</p>}
        </div>
      </Link>
    </article>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────
export default function WorkPage() {
  const { locale } = useLang();
  const [works, setWorks] = useState([]);
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [worksData, page] = await Promise.all([
          getWorks(),
          getWorkPage(locale),
        ]);
        setWorks(worksData || []);
        setPageData(page);
      } catch (err) {
        console.error("[WorkPage] erro ao carregar:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [locale]);

  return (
    <div className={styles.page}>
      {/* Hero */}
      <header className={styles.hero}>
        {pageData?.hero_title && (
          <h1 className={styles.heroTitle}>{pageData.hero_title}</h1>
        )}
        {pageData?.hero_subtitle && (
          <p className={styles.heroSubtitle}>{pageData.hero_subtitle}</p>
        )}
        {pageData?.cta_button_label && (
          <Button href="/contact" className={styles.heroBtn}>
            {pageData.cta_button_label}
          </Button>
        )}
      </header>

      {/* Grid */}
      {loading ? (
        <div className={styles.loading}>Carregando…</div>
      ) : (
        <section className={styles.grid}>
          {works.length === 0 ? (
            <p className={styles.empty}>Nenhum projeto cadastrado ainda.</p>
          ) : (
            works.map((work, i) => (
              <WorkCard key={work.id} work={work} index={i} />
            ))
          )}
        </section>
      )}
    </div>
  );
}
