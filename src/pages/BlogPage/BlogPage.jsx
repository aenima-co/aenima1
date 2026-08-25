import { useEffect, useState } from "react";
import { getBlogPage } from "../../api";
import styles from "./BlogPage.module.css";
import { resolveMediaUrl } from "../../config";
import { useLang } from "../../contexts/LanguageContext";
import { usePageTitle } from "../../hooks/usePageTitle";

export default function BlogPage() {
  const { lang } = useLang();
  usePageTitle("blog", lang);
  const [page, setPage] = useState(null);

  useEffect(() => {
    getBlogPage().then((data) => {
      console.log("[blog-page]", data);
      setPage(data);
    });
  }, []);

  if (!page) return null;

  const icons = page.botton_icon ?? [];
  const loadingBar = page.loading_bar;
  const loadingBarUrl = Array.isArray(loadingBar)
    ? loadingBar[0]?.url
    : loadingBar?.url;

  return (
    <div className={styles.page}>
      {/* Ícone 1 */}
      {icons[0]?.url && (
        <img src={resolveMediaUrl(icons[0].url)} alt="" className={styles.icon1} />
      )}

      {/* Linha do título: ícone2 + title + ícone2 */}
      <div className={styles.titleRow}>
        {icons[1]?.url && (
          <img src={resolveMediaUrl(icons[1].url)} alt="" className={styles.icon2} />
        )}
        {page.title && <h1 className={styles.title}>{page.title}</h1>}
        {icons[1]?.url && (
          <img src={resolveMediaUrl(icons[1].url)} alt="" className={styles.icon2} aria-hidden="true" />
        )}
      </div>

      {/* GIF loading bar */}
      {loadingBarUrl && (
        <img
          src={resolveMediaUrl(loadingBarUrl)}
          alt=""
          className={styles.loadingBar}
          loop="true"
        />
      )}

      {/* Subtítulo + ícone3 */}
      <div className={styles.subtitleRow}>
        {page.subtitle && <p className={styles.subtitle}>{page.subtitle}</p>}
        {icons[2]?.url && (
          <img src={resolveMediaUrl(icons[2].url)} alt="" className={styles.icon3} />
        )}
      </div>
    </div>
  );
}
