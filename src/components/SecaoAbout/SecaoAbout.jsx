import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { getHome, getEspecialidades } from '../../api';
import './SecaoAbout.css';
import { resolveMediaUrl } from '../../config';
import { useLoadError } from '../../contexts/LoadErrorContext';
import { Sentry } from '../../sentry';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

export default function SecaoAbout() {
  const [about, setAbout] = useState(null);
  const [especialidades, setEspecialidades] = useState([]);
  const { reportError, clearError } = useLoadError();
  const loadRef = useRef(() => {});

  const load = useCallback(() => {
    getHome()
      .then((data) => {
        setAbout(data?.secao_about_preview);
        clearError('secaoAbout');
      })
      .catch((err) => {
        console.error('[SecaoAbout] erro ao carregar:', err);
        Sentry.captureException(err);
        reportError('secaoAbout', () => loadRef.current());
      });
    getEspecialidades().then(setEspecialidades).catch(() => {});
  }, [reportError, clearError]);

  useEffect(() => {
    loadRef.current = load;
    load();
  }, [load]);

  if (!about) return <LoadingSpinner />;

  return (
    <section className="secao-about">
      <div className="secao-about__topo">
        <span className="secao-about__tag">// ABOUT</span>

        <div className="secao-about__layout">
          <div className="secao-about__titulo-wrap">
            <h2 className="secao-about__titulo">
              <span className="secao-about__titulo-parte1">
                {about.titulo_parte1} {about.titulo_parte2}
              </span>
              <span className="secao-about__titulo-destaque">{about.titulo_destaque}</span>
            </h2>
          </div>

          <div className="secao-about__direita">
            {about.icone?.url && (
              <img
                src={resolveMediaUrl(about.icone.url)}
                alt="ícone"
                className="secao-about__icone"
              />
            )}
            <p className="secao-about__descricao">{about.descricao}</p>
            {about.link_url?.startsWith('/') ? (
              <Link to={about.link_url} className="secao-about__link">
                {about.link_texto}
              </Link>
            ) : (
              <a href={about.link_url} className="secao-about__link" target="_blank" rel="noreferrer">
                {about.link_texto}
              </a>
            )}
          </div>
        </div>
      </div>

      {especialidades.length > 0 && (
        <div className="secao-about__pills-wrap">
          <div className="secao-about__pills">
            {especialidades.map((esp) => (
              <span key={esp.id} className="secao-about__pill">{esp.nome}</span>
            ))}
            {especialidades.map((esp) => (
              <span key={`dup-${esp.id}`} className="secao-about__pill" aria-hidden="true">{esp.nome}</span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}