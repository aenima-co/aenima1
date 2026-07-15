import { useState, useEffect } from "react";
import { getWorks, getWorkPage } from "../../api";
import styles from "./WorkPage.module.css";

const STRAPI_URL = "http://localhost:1337";

// ─── Card individual ──────────────────────────────────────────────────────────
function WorkCard({ work, index }) {
  const firstCover = Array.isArray(work.cover) ? work.cover[0] : work.cover;
  const imageUrl = firstCover?.url
    ? `${STRAPI_URL}${firstCover.url}`
    : firstCover?.formats?.large?.url
      ? `${STRAPI_URL}${firstCover.formats.large.url}`
      : null;

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
      <a href={`/work/${work.slug || work.id}`} className={styles.cardLink}>
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
      </a>
    </article>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────
export default function WorkPage() {
  const [works, setWorks] = useState([]);
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [worksData, page] = await Promise.all([
          getWorks(),
          getWorkPage(),
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
  }, []);

  return (
    <div className={styles.page}>
      {/* Hero */}
      <header className={styles.hero}>
        <h1 className={styles.heroTitle}>
          {pageData?.hero_title || "Selected Works"}
        </h1>
        <p className={styles.heroSubtitle}>
          {pageData?.hero_subtitle ||
            "We craft unique websites creating meaningful and memorable experiences."}
        </p>
        <a
          href="/contact"
          className={`cta-btn cta-btn--dark ${styles.heroBtn}`}
        >
          <span className="cta-btn__text">
            {pageData?.cta_button_label || "Start a Project"}
          </span>
          <span className="cta-btn__circle">
            <svg
              className="cta-btn__arrow"
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 11L11 1M11 10V1H2"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </a>
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
