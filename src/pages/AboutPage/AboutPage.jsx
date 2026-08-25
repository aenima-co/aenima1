import { useState, useEffect } from "react";
import { getAboutPage } from "../../api";
import { useLang } from "../../contexts/LanguageContext";
import styles from "./AboutPage.module.css";
import Button from "../../components/Button/Button";
import { resolveMediaUrl } from "../../config";
import { t } from "../../i18n/messages";
import { usePageTitle } from "../../hooks/usePageTitle";

// ─── Card de Valor ────────────────────────────────────────────────────────────
function ValueCard({ value }) {
  const iconUrl = resolveMediaUrl(value.icon?.url);

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

function FeatureText({ text }) {
  if (!text) return null;
  const keyword = "features:";
  const idx = text.toLowerCase().indexOf(keyword);
  if (idx === -1) return <p className={styles.memberFeatures}>{text}</p>;
  const before = text.slice(0, idx);
  const after = text.slice(idx + keyword.length);
  return (
    <p className={styles.memberFeatures}>
      {before}
      <span className={styles.memberFeaturesKeyword}>{text.slice(idx, idx + keyword.length)}</span>
      {after}
    </p>
  );
}

// ─── Card de Membro ───────────────────────────────────────────────────────────
function MemberCard({ member }) {
  const photo = Array.isArray(member.member_pic)
    ? member.member_pic[0]
    : member.member_pic;
  const photoUrl = resolveMediaUrl(photo?.url);

  return (
    <div className={styles.memberCard}>
      <div className={styles.memberPhoto}>
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={member.member_name}
            className={styles.memberImg}
          />
        ) : (
          <div className={styles.memberPhotoPlaceholder} />
        )}
      </div>
      <div className={styles.memberInfo}>
        <h3 className={styles.memberName}>{member.member_name}</h3>
        <p className={styles.memberRole}>{member.member_function}</p>
        <p className={styles.memberBio}>{member.member_description}</p>
        <FeatureText text={member.member_features} />
      </div>
    </div>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────
export default function AboutPage() {
  const { locale, lang } = useLang();
  usePageTitle("about", lang);
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const page = await getAboutPage(locale);
        setPageData(page);
      } catch (err) {
        console.error("[AboutPage] erro ao carregar:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [locale]);

  if (loading) return <div className={styles.loading}>{t(lang, "common.loading")}</div>;

  return (
    <div className={styles.page}>
      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroLeft}>
          <h1 className={styles.heroTitle}>
            {pageData?.hero_title || "// FEARLESS\nAUTHENTIC >>\n& (( EXPERTS"}
          </h1>
          <p className={styles.heroSubtitle}>
            {pageData?.hero_subtitle ||
              "We craft unique websites creating meaningful and memorable experiences."}
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
                {pageData?.card_text || "We craft unique websites creating"}
              </p>
              <Button href="/contact">Contact Us</Button>
            </div>
            <img
              src={
                pageData?.right_cards?.[0]?.url
                  ? resolveMediaUrl(pageData.right_cards[0].url)
                  : cardPixel
              }
              alt=""
              className={styles.heroCardImg}
            />
          </div>
          <img
            src={
              pageData?.right_cards?.[1]?.url
                ? resolveMediaUrl(pageData.right_cards[1].url)
                : cardOrange
            }
            alt=""
            className={styles.heroCardImgOrange}
          />
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
