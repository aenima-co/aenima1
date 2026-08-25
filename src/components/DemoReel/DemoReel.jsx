import { useEffect, useRef, useState } from 'react';
import { getDemoReel } from '../../api';
import { useLang } from '../../contexts/LanguageContext';
import './DemoReel.css';
import { resolveMediaUrl } from '../../config';

function PlayIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
      <polygon points="6,3 20,12 6,21" />
    </svg>
  );
}

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
  const { locale } = useLang();
  const [data, setData] = useState(null);
  const [playing, setPlaying] = useState(false);
  const iframeRef = useRef(null);

  useEffect(() => {
    getDemoReel(locale).then(setData);
  }, [locale]);

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

  if (!data) return null;

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
                aria-label="Reproduzir vídeo"
                onClick={(e) => { e.stopPropagation(); setPlaying(true); }}
              >
                <PlayIcon />
              </button>
            </div>
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
