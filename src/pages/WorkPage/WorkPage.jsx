import { useState, useEffect } from "react";
import { getWorks, getWorkPage } from "../../api";
import styles from "./WorkPage.module.css";

const STRAPI_URL = "http://localhost:1337";

// ─── Card individual ──────────────────────────────────────────────────────────
function WorkCard({ work, index }) {
  const imageUrl = work.cover?.url
    ? `${STRAPI_URL}${work.cover.url}`
    : work.cover?.formats?.large?.url
    ? `${STRAPI_URL}${work.cover.formats.large.url}`
    : null;

  const placeholders = [
    "#e8e4dc", "#ddd8ce", "#e0dbd0", "#d8d4ca",
    "#e4e0d8", "#dcd8d0", "#e2ddd5", "#d6d2c8", "#dedad2",
  ];
  const bgColor = placeholders[index % placeholders.length];

  return (
    <article
      className={styles.card}
      style={{ "--card-index": index }}
    >
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
          {work.client && (
            <p className={styles.cardClient}>{work.client}</p>
          )}
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
          {pageData?.hero_subtitle || "We craft unique websites creating meaningful and memorable experiences."}
        </p>
        <a href="/contact" className={styles.heroBtn}>
          {pageData?.cta_button_label || "Start a Project"}
          <span className={styles.heroBtnIcon}>↗</span>
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
