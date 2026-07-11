import { useState, useEffect } from "react";
import { getAboutPage } from "../../api";
import styles from "./AboutPage.module.css";
import Button from "../../components/Button/Button";
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
  const photo = Array.isArray(member.member_pic)
    ? member.member_pic[0]
    : member.member_pic;
  const photoUrl = photo?.url ? `${STRAPI_URL}${photo.url}` : null;

  return (
    <div className={styles.memberCard}>
      <div className={styles.memberPhoto}>
        {photoUrl ? (
          <img src={photoUrl} alt={member.member_name} className={styles.memberImg} />
        ) : (
          <div className={styles.memberPhotoPlaceholder} />
        )}
      </div>
      <div className={styles.memberInfo}>
        <h3 className={styles.memberName}>{member.member_name}</h3>
        <p className={styles.memberRole}>{member.member_function}</p>
        <p className={styles.memberBio}>{member.member_description}</p>
      </div>
    </div>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────
export default function AboutPage() {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const page = await getAboutPage();
        setPageData(page);
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
            {pageData?.hero_title || "// FEARLESS\nAUTHENTIC >>\n& (( EXPERTS"}
          </h1>
          <p className={styles.heroSubtitle}>
            {pageData?.hero_subtitle || "We craft unique websites creating meaningful and memorable experiences."}
          </p>

          {/* Valores ficam aqui no layout desktop */}
          <div className={styles.values}>
            {(pageData?.about_description || []).map((v) => (
              <ValueCard key={v.id} value={v} />
            ))}
          </div>
        </div>

        <div className={styles.heroRight}>
          <div className={styles.heroRightLeft}>
            <div className={styles.heroCardText}>
              <p className={styles.heroCardTextContent}>
                We craft unique websites creating
              </p>
              <Button>Contact Us</Button>
            </div>
            <img src={cardPixel} alt="" className={styles.heroCardImg} />
          </div>
          <img src={cardOrange} alt="" className={styles.heroCardImgOrange} />
        </div>
      </section> 

      {/* ── Time ── */}
      <section className={styles.team}>
        {(pageData?.members_detail || []).map((m) => (
          <MemberCard key={m.id} member={m} />
        ))}
      </section>

    </div>
  );
}
