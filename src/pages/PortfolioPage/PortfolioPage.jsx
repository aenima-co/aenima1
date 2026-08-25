import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { getWorkBySlug, getWorks } from "../../api";
import styles from "./PortfolioPage.module.css";
import { resolveMediaUrl } from "../../config";
import { useLang } from "../../contexts/LanguageContext";
import { usePageTitle } from "../../hooks/usePageTitle";

function getCoverUrl(item) {
  if (!item) return null;
  return resolveMediaUrl(item.url);
}

function isFullWidthImage(item) {
  const title =
    `${item?.name || ""} ${item?.alternativeText || ""}`.toLowerCase();
  return title.includes("full");
}

// ─── Carousel card ────────────────────────────────────────────────────────────
function CarouselCard({ work }) {
  const firstCover = Array.isArray(work.cover) ? work.cover[0] : work.cover;
  const imgUrl = getCoverUrl(firstCover);

  return (
    <Link to={`/work/${work.slug || work.id}`} className={styles.carouselCard}>
      <div className={styles.carouselImageWrap}>
        {imgUrl ? (
          <img
            src={imgUrl}
            alt={work.title}
            className={styles.carouselImg}
            loading="lazy"
          />
        ) : (
          <div className={styles.carouselPlaceholder} />
        )}
      </div>
      <div className={styles.carouselInfo}>
        <h3 className={styles.carouselTitle}>{work.title}</h3>
        {work.client && <p className={styles.carouselClient}>{work.client}</p>}
      </div>
    </Link>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────
export default function PortfolioPage() {
  const { slug } = useParams();
  const { lang } = useLang();
  const [work, setWork] = useState(null);
  usePageTitle("work", lang, work?.title);
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef(null);
  const dragState = useRef({ isDown: false, startX: 0, scrollLeft: 0 });

  function onMouseDown(e) {
    const el = carouselRef.current;
    dragState.current = {
      isDown: true,
      startX: e.pageX - el.offsetLeft,
      scrollLeft: el.scrollLeft,
    };
    el.classList.add(styles.dragging);
  }

  function onMouseLeaveOrUp() {
    dragState.current.isDown = false;
    carouselRef.current?.classList.remove(styles.dragging);
  }

  function onMouseMove(e) {
    if (!dragState.current.isDown) return;
    e.preventDefault();
    const el = carouselRef.current;
    const x = e.pageX - el.offsetLeft;
    el.scrollLeft =
      dragState.current.scrollLeft - (x - dragState.current.startX) * 1.5;
  }

  useEffect(() => {
    async function load() {
      try {
        const [workData, worksData] = await Promise.all([
          getWorkBySlug(slug),
          getWorks(),
        ]);
        setWork(workData);
        setWorks(worksData || []);
      } catch (err) {
        console.error("[PortfolioPage] erro:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  if (loading) return <div className={styles.loading}>Carregando…</div>;
  if (!work)
    return <div className={styles.notFound}>Projeto não encontrado.</div>;

  const covers = Array.isArray(work.cover)
    ? work.cover
    : work.cover
      ? [work.cover]
      : [];

  const firstCover = getCoverUrl(covers[0]);
  const galleryCover = covers.slice(1);

  const infoLabels = ["SERVICES", "INDUSTRY", "YEAR", "COUNTRY"];
  const infoValues = [
    work.info?.services ?? "",
    work.info?.industry ?? "",
    work.info?.year ?? "",
    work.info?.country ?? "",
  ];

  const secoes = [
    work.secoes?.line1,
    work.secoes?.line2,
    work.secoes?.line3,
    work.secoes?.line4,
  ].filter(Boolean);

  return (
    <div className={styles.page}>
      {/* Linha 1: Título + Resume */}
      <div className={styles.row1}>
        <h1 className={styles.title}>{work.title}</h1>
        <p className={styles.resume}>{work.resume}</p>
      </div>

      {/* Linha 2: Primeira imagem do cover */}
      {firstCover && (
        <div className={styles.row2}>
          <img src={firstCover} alt={work.title} className={styles.coverImg} />
        </div>
      )}

      {/* Linha 3: Info + Descrição */}
      <div className={styles.row3}>
        {/* Coluna 1: tabela de info */}
        <div className={styles.infoTable}>
          {infoLabels.map((label, i) => (
            <div key={label} className={styles.infoRow}>
              <span className={styles.infoLabel}>{label}</span>
              <span className={styles.infoValue}>{infoValues[i] || ""}</span>
            </div>
          ))}
        </div>

        {/* Coluna 2: Description + Details */}
        <div className={styles.descSection}>
          <h2 className={styles.sectionLabel}>Description</h2>
          <p className={styles.sectionText}>{work.description}</p>
          {secoes.length > 0 && (
            <>
              <h2 className={styles.sectionLabel}>Details</h2>
              <ul className={styles.detailsList}>
                {secoes.map((item, i) => (
                  <li key={i} className={styles.sectionText}>
                    {item}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>

      {/* Galeria: imagens do cover a partir da 3ª */}
      {galleryCover.length > 0 && (
        <div className={styles.gallery}>
          {galleryCover.map((img, i) => (
            <img
              key={i}
              src={getCoverUrl(img)}
              alt={`${work.title} ${i + 3}`}
              className={
                isFullWidthImage(img)
                  ? `${styles.galleryImg} ${styles.galleryImgFull}`
                  : styles.galleryImg
              }
            />
          ))}
        </div>
      )}

      {/* Carrossel de works */}
      {works.length > 0 && (
        <div className={styles.carouselSection}>
          <div
            className={styles.carousel}
            ref={carouselRef}
            onMouseDown={onMouseDown}
            onMouseLeave={onMouseLeaveOrUp}
            onMouseUp={onMouseLeaveOrUp}
            onMouseMove={onMouseMove}
          >
            {works.map((w) => (
              <CarouselCard key={w.id} work={w} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
