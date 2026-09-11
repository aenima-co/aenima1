import { useCallback, useEffect, useRef, useState } from 'react';
import { getDemoReel } from '../../api';
import { useLang } from '../../contexts/LanguageContext';
import './DemoReel.css';
import { resolveMediaUrl } from '../../config';
import { t } from '../../i18n/messages';
import { useLoadError } from '../../contexts/LoadErrorContext';
import { Sentry } from '../../sentry';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

function PlayIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
      <polygon points="6,3 20,12 6,21" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 5.5V11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="10" cy="14.25" r="1" fill="currentColor" />
    </svg>
  );
}

// Vimeo não expõe pro parent se o embed falhou (ex: 401 de domínio não
// autorizado) — um iframe cross-origin sempre dispara "load" mesmo quando
// mostra a própria página de erro dele. O jeito de perceber a falha é
// esperar o "ready" que o player manda via postMessage quando carrega de
// verdade; se não chegar dentro do prazo, assumimos que o embed falhou.
const EMBED_READY_TIMEOUT_MS = 7000;

const VIMEO_CLEAN = 'title=0&byline=0&portrait=0&badge=0&controls=0&dnt=1';

function parseSrc(iframeStr) {
  if (!iframeStr) return '';
  const match = iframeStr.match(/src="([^"]+)"/);
  if (!match) return '';
  const url = match[1];
  const sep = url.includes('?') ? '&' : '?';
  return `${url}${sep}${VIMEO_CLEAN}`;
}

export default function DemoReel() {
  const { locale, lang } = useLang();
  const [data, setData] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [embedFailed, setEmbedFailed] = useState(false);
  const { reportError, clearError } = useLoadError();
  const iframeRef = useRef(null);
  const loadRef = useRef(() => {});

  const load = useCallback(() => {
    getDemoReel(locale)
      .then((data) => {
        setData(data);
        clearError('demoReel');
      })
      .catch((err) => {
        console.error('[DemoReel] erro ao carregar:', err);
        Sentry.captureException(err);
        reportError('demoReel', () => loadRef.current());
      });
  }, [locale, reportError, clearError]);

  useEffect(() => {
    loadRef.current = load;
    load();
  }, [load]);

  useEffect(() => {
    let ready = false;

    function onReadyCheck(e) {
      try {
        const msg = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
        if (msg.event === 'ready') {
          ready = true;
          setEmbedFailed(false);
        }
      } catch (_) {}
    }

    window.addEventListener('message', onReadyCheck);
    const timer = setTimeout(() => {
      if (!ready) setEmbedFailed(true);
    }, EMBED_READY_TIMEOUT_MS);

    return () => {
      window.removeEventListener('message', onReadyCheck);
      clearTimeout(timer);
    };
  }, [data]);

  useEffect(() => {
    if (!playing) return;

    function onMessage(e) {
      if (!iframeRef.current) return;
      try {
        const msg = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
        if (msg.event === 'ready') {
          iframeRef.current.contentWindow.postMessage(
            JSON.stringify({ method: 'addEventListener', value: 'finish' }),
            '*'
          );
        }
        if (msg.event === 'finish') {
          setPlaying(false);
        }
      } catch (_) {}
    }

    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [playing]);

  if (!data) return <LoadingSpinner />;

  const { demo_titulo, video_link, stickers } = data;
  const baseSrc = parseSrc(video_link);
  const activeSrc = playing ? `${baseSrc}&autoplay=1` : baseSrc;
  const decor = Array.isArray(stickers) ? stickers.slice(0, 3) : [];

  return (
    <section className="demo-reel">
      {demo_titulo && (
        <div className="demo-reel__titulo">
          <p className="demo-reel__linha1">{demo_titulo.titulo_linha1}</p>
          <p className="demo-reel__linha2">{demo_titulo.titulo_linha2}</p>
          <p className="demo-reel__linha3">{demo_titulo.titulo_linha3}</p>
        </div>
      )}

      <div className="demo-reel__stage">
        <div className="demo-reel__wrapper">
          {embedFailed ? (
            <div className="demo-reel__fallback">
              <span className="demo-reel__fallback-icon">
                <AlertIcon />
              </span>
              <p className="demo-reel__fallback-text">{t(lang, 'demoReel.unavailable')}</p>
            </div>
          ) : (
            <>
              {baseSrc && (
                <iframe
                  ref={iframeRef}
                  className="demo-reel__iframe"
                  src={activeSrc}
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  title="Demo Reel"
                />
              )}

              {!playing && (
                <div className="demo-reel__overlay" onClick={() => setPlaying(true)}>
                  <button
                    className="demo-reel__play-btn"
                    aria-label={t(lang, 'demoReel.playVideo')}
                    onClick={(e) => { e.stopPropagation(); setPlaying(true); }}
                  >
                    <PlayIcon />
                  </button>
                </div>
              )}
            </>
          )}

          {decor.map((img, i) => (
            <img
              key={img.id}
              src={resolveMediaUrl(img.url)}
              alt=""
              className={`demo-reel__decor demo-reel__decor--${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
