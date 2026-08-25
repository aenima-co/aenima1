import { useEffect, useState } from 'react';
import { getFooter } from '../../api';
import { useLang } from '../../contexts/LanguageContext';
import './Footer.css';
import { resolveMediaUrl } from '../../config';

function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function resolveMedia(field) {
  if (!field) return null;
  if (Array.isArray(field)) return resolveMediaUrl(field[0]?.url);
  if (field.url) return resolveMediaUrl(field.url);
  return null;
}

function getSocials(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') return value.split('\n').filter(Boolean).map(s => ({ nome: s, link: '#' }));
  return [];
}

// Links vindos do Strapi às vezes não têm protocolo (ex: "instagram.com"),
// o que faz o navegador tratar como caminho relativo do próprio site em
// vez de um link externo.
function normalizeUrl(url) {
  if (!url || url === '#') return '#';
  if (/^(https?:)?\/\//i.test(url) || /^(mailto|tel):/i.test(url)) return url;
  return `https://${url}`;
}

function useClock() {
  const [clock, setClock] = useState({ time: '', date: '' });
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
      const tzAbbr = new Intl.DateTimeFormat('en', { timeZoneName: 'short' })
        .formatToParts(now).find(p => p.type === 'timeZoneName')?.value || '';
      const date = now.toLocaleDateString(navigator.language, {
        day: '2-digit', month: 'short', year: 'numeric',
      }).toUpperCase().replace(/[.,]/g, '');
      setClock({ time: `${time} [${tzAbbr}]`, date });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return clock;
}

export default function Footer() {
  const { locale } = useLang();
  const [footer, setFooter] = useState(null);
  const [members, setMembers] = useState([]);
  const clock = useClock();

  useEffect(() => {
    getFooter(locale).then(data => {
      setFooter(data);
      setMembers(data?.memberCard || []);
    });
  }, [locale]);

  const bgDesktop = resolveMedia(footer?.background);
  const bgMobile = resolveMedia(footer?.backmobile);
  const arrowSrc = resolveMedia(footer?.arrow_icon);
  const logoSrc = resolveMedia(footer?.logo);
  const socials = getSocials(footer?.redes_sociais);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer
      className="footer"
      style={{
        ...(bgDesktop && { '--bg-desktop': `url(${bgDesktop})` }),
        ...(bgMobile && { '--bg-mobile': `url(${bgMobile})` }),
      }}
    >
      <div className="footer__inner">

        <div className="footer__top-area">

          {/* Coluna esquerda: members + email */}
          <div className="footer__left">
            <div className="footer__row1">
              {members.length > 0 && (
                <div className="footer__members">
                  {members.map(m => {
                    const foto = resolveMedia(m.members_image);
                    return (
                      <div key={m.id} className="footer__member">
                        {foto && (
                          <img src={foto} alt={m.nome || ''} className="footer__avatar" />
                        )}
                        <div className="footer__member-tooltip" role="tooltip">
                          <div className="footer__member-tooltip-header">
                            <span className="footer__member-name">{m.nome}</span>
                            <a
                              href={m.linkedin || '#'}
                              target={m.linkedin ? '_blank' : undefined}
                              rel="noreferrer"
                              className="footer__member-linkedin"
                              aria-label={`LinkedIn de ${m.nome}`}
                            >
                              <LinkedInIcon />
                            </a>
                          </div>
                          <span className="footer__member-role">{m.funcao}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              <p className="footer__title">Let's collaborate</p>
            </div>

            {footer?.email && (
              <div className="footer__row2">
                {arrowSrc && <img src={arrowSrc} alt="" className="footer__arrow" />}
                <a href={`mailto:${footer.email}`} className="footer__cta-link">
                  {footer.email}
                </a>
              </div>
            )}
          </div>

          {/* Coluna direita: socials + meta */}
          <div className="footer__row3">
            <div className="footer__socials">
              {socials.map((s, i) => (
                <a
                  key={i}
                  href={normalizeUrl(s.link || s.url)}
                  className="footer__social-item"
                  target="_blank"
                  rel="noreferrer"
                >
                  {s.nome || s.name || s}
                </a>
              ))}
            </div>

            <div className="footer__meta">
              <button className="footer__back-top" onClick={scrollToTop}>
                {footer?.top || '↑ BACK TO TOP'}
              </button>
              <p className="footer__clock">
                {clock.time}<br />{clock.date}
              </p>
              <p className="footer__copyright">
                © {footer?.ano_copyright} {footer?.nome_empresa}
              </p>
            </div>
          </div>

        </div>

        {logoSrc && (
          <div className="footer__logo-wrap">
            <img src={logoSrc} alt="Aenima" className="footer__logo" />
          </div>
        )}

      </div>
    </footer>
  );
}
