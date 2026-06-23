import { useState, useEffect } from "react";
import { getAboutPage, getValues, getTeamMembers } from "../../api";
import styles from "./AboutPage.module.css";
import cardPurple from "../../assets/img/about-card-purple.png";
import cardPixel from "../../assets/img/about-card-pixel.png";
import cardOrange from "../../assets/img/about-card-orange.png";

const STRAPI_URL = "http://localhost:1337";

// ─── Card de Valor ────────────────────────────────────────────────────────────
function ValueCard({ value }) {
  const iconUrl = value.icon?.url
    ? `${STRAPI_URL}${value.icon.url}`
    : null;

  return (
    <div className={styles.valueCard}>
      <div className={styles.valueIcon}>
        {iconUrl ? (
          <img src={iconUrl} alt={value.title} width={64} height={64} />
        ) : (
          <span className={styles.valueIconPlaceholder}>✦</span>
        )}
      </div>
      <h3 className={styles.valueTitle}>{value.title}</h3>
      <p className={styles.valueDesc}>{value.description}</p>
    </div>
  );
}

// ─── Card de Membro ───────────────────────────────────────────────────────────
function MemberCard({ member }) {
  const photoUrl = member.photo?.url
    ? `${STRAPI_URL}${member.photo.url}`
    : null;

  return (
    <div className={styles.memberCard}>
      <div className={styles.memberPhoto}>
        {photoUrl ? (
          <img src={photoUrl} alt={member.name} className={styles.memberImg} />
        ) : (
          <div className={styles.memberPhotoPlaceholder} />
        )}
      </div>
      <div className={styles.memberInfo}>
        <h3 className={styles.memberName}>{member.name}</h3>
        <p className={styles.memberRole}>{member.role}</p>
        <p className={styles.memberBio}>{member.bio}</p>
      </div>
    </div>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────
export default function AboutPage() {
  const [pageData, setPageData] = useState(null);
  const [values, setValues] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [page, vals, team] = await Promise.all([
          getAboutPage(),
          getValues(),
          getTeamMembers(),
        ]);
        setPageData(page);
        setValues(vals || []);
        setMembers(team || []);
      } catch (err) {
        console.error("[AboutPage] erro ao carregar:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div className={styles.loading}>Carregando…</div>;

  return (
    <div className={styles.page}>

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroLeft}>
          <h1 className={styles.heroTitle}>
            {pageData?.hero_title || "// FEARLESS AUTHENTIC >> & (( EXPERTS"}
          </h1>
          <p className={styles.heroSubtitle}>
            {pageData?.hero_subtitle || "We craft unique websites creating meaningful and memorable experiences."}
          </p>

          {/* Valores ficam aqui no layout desktop */}
          <div className={styles.values}>
            {values.map((v) => (
              <ValueCard key={v.id} value={v} />
            ))}
          </div>
        </div>

        <div className={styles.heroRight}>
          <div className={styles.heroRightLeft}>
            <img src={cardPurple} alt="" className={styles.heroCardImg} />
            <img src={cardPixel} alt="" className={styles.heroCardImg} />
          </div>
          <img src={cardOrange} alt="" className={styles.heroCardImgOrange} />
        </div>
      </section> 

      {/* ── Time ── */}
      <section className={styles.team}>
        {members.map((m) => (
          <MemberCard key={m.id} member={m} />
        ))}
      </section>

    </div>
  );
}
